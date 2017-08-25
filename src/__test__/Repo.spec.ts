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
    return t.fail('users is empty but its expected to have 2 records.')
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

test('Repo can get all data of the entity that matches the where query', (t) => {
  const state = {
    name: 'entities',
    users: { data: {
      '1': { id: 1, role: 'admin', sex: 'male' },
      '2': { id: 2, role: 'user', sex: 'female' },
      '3': { id: 3, role: 'admin', sex: 'male' }
    }}
  }

  const expected = [
    { id: 1, role: 'admin', sex: 'male' },
    { id: 3, role: 'admin', sex: 'male' }
  ]

  const result = Repo.query(state, 'users', false)
    .where('role', 'admin')
    .where('sex', 'male')
    .get()

  t.deepEqual(result, expected)
})

test('Repo can get single data of the entity that matches the where query', (t) => {
  const state = {
    name: 'entities',
    users: { data: {
      '1': { id: 1, role: 'admin', sex: 'male' },
      '2': { id: 2, role: 'user', sex: 'female' },
      '3': { id: 3, role: 'admin', sex: 'male' }
    }}
  }

  const expected = { id: 1, role: 'admin', sex: 'male' }

  const result = Repo.query(state, 'users', false)
    .where('role', 'admin')
    .where('sex', 'male')
    .first()

  t.deepEqual(result, expected)
})

test('Repo can find a single item of entity by id', (t) => {
  const state = {
    name: 'entities',
    users: { data: {
      '1': { id: 1 },
      '2': { id: 2 }
    }}
  }

  const user = Repo.find(state, 'users', 2)

  if (user === null) {
    return t.fail('user is empty but its expected to have 1 record.')
  }

  t.true(user instanceof User)
  t.is(user.id, 2)
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
