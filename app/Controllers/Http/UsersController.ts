import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class UsersController {
  /**
   * @swagger
   * /api/users:
   * post:
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           description: User payload
   *           schema:
   *             type: object
   *             properties:
   *               phone:
   *                 type: string
   *                 example: 'James Bond'
   *                 required: true
   *               email:
   *                 type: string
   *                 example: 'Bond007@example.com'
   *                 required: true
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */

  public async login(ctx: HttpContextContract) {
    return Database.from('users').select('*')
  }

  public async signup(ctx: HttpContextContract) {
    return Database.table('users').insert({
      username: 'admin',
      password: 'password',
      email: 'sharpprogrammer2018@gmail.com',
    })
  }
}
