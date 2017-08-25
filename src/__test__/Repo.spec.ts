import test from 'ava'
import Container from '../connections/Container'
import Database from '../Database'
import Model from '../Model'
import Repo from '../Repo'

class User extends Model {
  static entity = 'users'

  static fields () {
    return { id: this.attr(null) }
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

test('Repo can get all data of the entity as class', (t) => {
  const state = {
    name: 'entities',
    users: { data: {
      '1': { id: 1 },
      '2': { id: 2 }
    }}
  }

  const users = Repo.all(state, 'users')

  if (users === null) {
    t.fail('users is empty but its expected to have 2 records.')

    return
  }

  t.true(users[0] instanceof User)
  t.is(users[0].id, 1)
  t.is(users[1].id, 2)
})

test('Repo can get all data of the entity as plain object', (t) => {
  const state = {
    name: 'entities',
    users: { data: {
      '1': { id: 1 },
      '2': { id: 2 }
    }}
  }

  const expected = [{ id: 1 }, { id: 2 }]

  t.deepEqual(Repo.all(state, 'users', false), expected)
})

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
