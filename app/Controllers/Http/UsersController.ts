import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import jsonwebtoken from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import User from '../../Models/User'

export default class UsersController {
  /**
   *
   * Login In
   *
   */
  public async login({ request, response }) {
    const loginSchema = schema.create({
      email: schema.string(),
      password: schema.string(),
    })

    let payload

    try {
      payload = await request.validate({
        schema: loginSchema,
        message: {
          required: 'The {{ field }} is required to create a new account',
        },
      })
    } catch (err) {
      return response.send({ status: err.status, msg: err.message })
    }

    const user = await User.findBy('email', payload.email)
    const hashedPassword = await Hash.make(payload.password)
    if (!user || !(await Hash.verify(hashedPassword, payload.password)))
      return response.status(404).send({ msg: 'Invalid Login Credentials' })

    const token = this.generateAccessToken(user.username)
    return response.send({ token, msg: 'Sucessfully logged In!' })
  }

  /**
   *
   * Sign up
   *
   */
  public async signup({ request, response }) {
    const newUserSchema = schema.create({
      email: schema.string(),
      password: schema.string(),
      username: schema.string(),
    })

    let payload

    try {
      payload = await request.validate({
        schema: newUserSchema,
        message: {
          required: 'The {{ field }} is required to create a new account',
        },
      })
    } catch (err) {
      return response.status(err.status || 500).send({ msg: err.messages })
    }

    const user = await Database.from('users')
      .where('email', payload.email)
      .orWhere('username', payload.username)
      .first()

    if (user) {
      if (user.email == payload.email)
        return response.status(409).send({ message: 'Email Already exists, please log in' })
      else if (user.username == payload.username)
        return response.status(409).send({
          message: 'username is taken, please choose another one',
        })
    }

    const newUser = new User()
    newUser.email = payload.email
    newUser.username = payload.username
    newUser.password = await Hash.make(payload.password)

    await newUser.save()

    if (newUser.$isPersisted) {
      const token = this.generateAccessToken(payload.username)
      response.send({ status: 200, msg: 'Account created, Sucessfully!', token })
    } else {
      response.status(409).send({ msg: 'Something Went Wrong' })
    }
  }

  /**
   *
   * Delete User
   *
   */
  public async delete({ request, response }) {
    const deleteSchema = schema.create({
      email: schema.string(),
      adminKey: schema.string({}, [rules.adminKey()]),
    })

    let payload

    try {
      payload = await request.validate({
        schema: deleteSchema,
        message: {
          required: 'The {{ field }} is required ',
        },
      })
    } catch (err) {
      return response.status(err.status || 500).send({ msg: err.messages })
    }

    const user = await User.findBy('email', payload.email)
    await user?.delete()

    if (user?.$isDeleted === false) return response.status(404).send({ msg: 'User doesnt exist' })
    return response.status(200).send({ msg: 'Sucessfully deleted the email' })
  }

  private generateAccessToken(username: string) {
    return jsonwebtoken.sign(username, Env.get('SECRET'))
  }
}
