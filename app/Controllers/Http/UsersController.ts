import { schema } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import jsonwebtoken from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import User from '../../Models/User'

export default class UsersController {
  // log in
  //
  //
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
      return response.send({ status: 401, msg: 'Invalid Login Credentials' })

    const token = this.generateAccessToken(user.username)
    return response.send({ status: 200, token, msg: 'Sucessfully logged In!' })
  }

  // sign up
  //
  //
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
      return response.send({ status: err.status, msg: err.messages })
    }

    const user = await Database.from('users')
      .where('email', payload.email)
      .orWhere('username', payload.username)
      .first()

    if (user) {
      if (user.email == payload.email)
        return response.send({ status: 409, message: 'Email Already exists, please log in' })
      else if (user.username == payload.username)
        return response.send({
          status: 409,
          message: 'username is taken, please choose another one',
        })
    }

    const newUser = new User()
    newUser.email = payload.email
    newUser.username = payload.username
    newUser.password = await Hash.make(payload.password)

    console.log(await newUser.save())

    if (newUser.$isPersisted) {
      const token = this.generateAccessToken(payload.username)
      response.send({ status: 200, msg: 'Account created, Sucessfully!', token })
    } else {
      response.send({ status: 409, msg: 'Something Went Wrong' })
    }
  }

  private generateAccessToken(username: string) {
    return jsonwebtoken.sign(username, Env.get('SECRET'))
  }
}
