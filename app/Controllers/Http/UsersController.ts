import { schema } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'

export default class UsersController {
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

    const user = await Database.from('users').where('email', payload.email)
    console.log(user)
    const hashedPassword = await Hash.make(payload.password)
    if (!user || !(await Hash.verify(hashedPassword, payload.password)))
      return response.send({ status: 401, msg: 'Invalid Login Credentials' })

    return response.send({ staus: 200, msg: 'You have an account' })
  }

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

    // validate if users exists already or not
    await Database.from('users').where('email', payload.email)

    await Database.table('users')
      .insert({
        username: payload.username,
        password: await Hash.make(payload.password),
        email: payload.email,
      })
      .then(() => {
        response.send({ status: 200, msg: 'Account created, Sucessfully!' })
      })
      .catch((err) => {
        console.log(`error when inserting a user: ${err}`)
        response.send({ status: 409, msg: 'Account created, Sucessfully!' })
      })
  }
}
