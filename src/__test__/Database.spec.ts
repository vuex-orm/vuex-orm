import test from 'ava'
import Model from '../Model'
import Database from '../Database'

class User extends Model {
  static entity = 'users'
}

class Post extends Model {
  static entity = 'posts'
}

const users = { actions: {} }
const posts = { mutations: {} }

test('Database can register models', (t) => {
  const database = new Database()

  const expected = [
    { model: User, module: users },
    { model: Post, module: posts }
  ]

  database.register(User, users)
  database.register(Post, posts)

  t.deepEqual<any>(database.entities, expected)
})

test('Database can generate Vuex Module Tree from registered entities', (t) => {
  const database = new Database()

  database.register(User, users)
  database.register(Post, posts)

  const expected = {
    namespaced: true,

    modules: {
      users: {
        namespaced: true,
        state: { data: {} },
        actions: {}
      },
      posts: {
        namespaced: true,
        state: { data: {} },
        mutations: {}
      }
    }
  }

  t.deepEqual<any>(database.modules(), expected)
})
