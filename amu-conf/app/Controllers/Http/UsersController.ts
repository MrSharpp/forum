import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async login(ctx: HttpContextContract) {
    return [{ id: 1, username: 'hello' }]
  }
}
