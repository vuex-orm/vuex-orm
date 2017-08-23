import test from 'ava'
import * as sinon from 'sinon'
import Model from '../Model'
import Database from '../Database'
import VuexOrm from '..'

class User extends Model {
  static entity = 'users'
}

class Post extends Model {
  static entity = 'posts'
}

const users = {}
const posts = {}

test('Vuex ORM can register its database to Vuex Store', (t) => {
  const registerModule = sinon.stub()
  const store: any = { registerModule }

  const database = new Database()

  database.register(User, users)
  database.register(Post, posts)

  VuexOrm(database)(store)

  t.true(registerModule.withArgs('entities', database.modules()).calledOnce)
})

test('Vuex ORM lets user override the namespace', (t) => {
  const registerModule = sinon.stub()
  const store: any = { registerModule }

  const database = new Database()

  database.register(User, users)
  database.register(Post, posts)

  const options = { namespace: 'myNameSpace' }

  VuexOrm(database, options)(store)

  t.true(registerModule.withArgs('myNameSpace', database.modules()).calledOnce)
})
