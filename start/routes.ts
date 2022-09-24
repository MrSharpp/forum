/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

// Organizations Routes
Route.get('/orgs', 'OrgsController.index')
Route.post('/orgs', 'OrgsController.create')
Route.patch('/orgs', 'OrgsController.updateOrg')
Route.delete('/orgs/delete', 'OrgsController.delete')

// Lobbies Routes
Route.get('/lobby', 'LobbiesController.index')
Route.post('/lobby', 'LobbiesController.create')
Route.delete('/lobby/delete', 'LobbiesController.delete')

// Posts Routes
Route.get('/post', 'PostsController.index')
Route.post('/post', 'PostsController.create')
Route.delete('/post/delete', 'PostsController.delete')

// user Authentication
Route.post('/login', 'UsersController.login')
Route.post('/signup', 'UsersController.signup')
Route.delete('/user/delete', 'UsersController.delete')
