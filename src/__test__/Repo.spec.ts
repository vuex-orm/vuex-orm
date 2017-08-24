import test from 'ava'
import Container from '../connections/Container'
import Database from '../Database'
import Model from '../Model'
import Repo from '../Repo'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {}
  }
}

class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      author: this.belongsTo(User, 'user_id')
    }
  }
}

const database = new Database()

database.register(User, {})
database.register(Post, {})

Container.register('entities', database)

test('Repo can create data in Vuex Store', (t) => {
  const state = {
    name: 'entities',
    users: { data: {} },
    posts: { data: {} }
  }

  const data = {
    posts: [
      {
        id: 1,
        title: 'Title 001',
        author: {
          id: 10,
          name: 'John Doe'
        }
      },
      {
        id: 2,
        title: 'Title 002',
        author: {
          id: 11,
          name: 'Jane Doe'
        }
      }
    ]
  }

  const expected = {
    name: 'entities',
    users: { data: {
      '10': { id: 10, name: 'John Doe' },
      '11': { id: 11, name: 'Jane Doe' }
    }},
    posts: { data: {
      '1': { id: 1, title: 'Title 001', author: 10 },
      '2': { id: 2, title: 'Title 002', author: 11 }
    }}
  }

  Repo.create(state, data)

  t.deepEqual(state, expected)
})
