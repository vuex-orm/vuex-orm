import { createApplication } from 'test/support/Helpers'
import User from 'test/fixtures/models/User'
import Profile from 'test/fixtures/models/Profile'
import Account from 'test/fixtures/models/Account'
import Post from 'test/fixtures/models/Post'
import Comment from 'test/fixtures/models/Comment'
import Review from 'test/fixtures/models/Review'
import Like from 'test/fixtures/models/Like'
import Cluster from 'test/fixtures/models/Cluster'
import Node from 'test/fixtures/models/Node'
import CustomKey from 'test/fixtures/models/CustomKey'
import Repo from 'app/Repo'

describe('Repo – Retrieve', () => {
  beforeEach(() => {
    createApplication('entities', [
      { model: User },
      { model: Profile },
      { model: Account },
      { model: Post },
      { model: Comment },
      { model: Review },
      { model: Like },
      { model: Cluster },
      { model: Node },
      { model: CustomKey }
    ])
  })

  it('can get all data of the entity as class', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1 },
        '2': { id: 2 }
      }},
      profiles: { data: {} },
      posts: { data: {} }
    }

    const users = Repo.all(state, 'users')

    if (users === null) {
      return t.fail('users is empty but its expected to have 2 records.')
    }

    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].id).toBe(1)
    expect(users[1].id).toBe(2)
  })

  it('can get all data of the entity as plain object', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1 },
        '2': { id: 2 }
      }},
      profiles: { data: {} },
      posts: { data: {} }
    }

    const expected = [{ id: 1 }, { id: 2 }]

    expect(Repo.all(state, 'users', false)).toEqual(expected)
  })

  it('can get all with all method chained with query', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1 },
        '2': { id: 2 }
      }},
      profiles: { data: {} },
      posts: { data: {} }
    }

    const expected = [{ id: 1 }, { id: 2 }]

    expect(Repo.query(state, 'users', false).all()).toEqual(expected)
  })

  it('can get all data of the entity that matches the where query', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, role: 'admin', sex: 'male', enabled: true },
        '2': { id: 2, role: 'user', sex: 'female', enabled: true },
        '3': { id: 3, role: 'admin', sex: 'male', enabled: true },
        '4': { id: 4, role: 'admin', sex: 'male', enabled: false }
      }}
    }

    const expected = [
      { id: 1, role: 'admin', sex: 'male', enabled: true },
      { id: 3, role: 'admin', sex: 'male', enabled: true }
    ]

    const result = Repo.query(state, 'users', false)
      .where('role', 'admin')
      .where('sex', 'male')
      .where('enabled', true)
      .get()

    expect(result).toEqual(expected)
  })

  it('can get all data of the entity that matches the where query value as array', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, role: 'user', sex: 'male', enabled: true },
        '2': { id: 2, role: 'user', sex: 'female', enabled: true },
        '3': { id: 3, role: 'admin', sex: 'male', enabled: true },
        '4': { id: 4, role: 'admin', sex: 'male', enabled: false },
        '5': { id: 5, role: 'guest', sex: 'male', enabled: true }
      }}
    }

    const expected = [
      { id: 1, role: 'user', sex: 'male', enabled: true },
      { id: 3, role: 'admin', sex: 'male', enabled: true }
    ]

    const result = Repo.query(state, 'users', false)
      .where('role', ['admin', 'user'])
      .where('sex', 'male')
      .where('enabled', true)
      .get()

    expect(result).toEqual(expected)
  })

  it('can get single data of the entity that matches the where query', () => {
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

    expect(result).toEqual(expected)
  })


  it('can get data of the entity that matches the where query with callback as value', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, role: 'admin', age: 20 },
        '2': { id: 2, role: 'user', age: 30 },
        '3': { id: 3, role: 'admin', age: 40 }
      }}
    }

    const expected = [
      { id: 1, role: 'admin', age: 20 },
      { id: 2, role: 'user', age: 30 }
    ]

    const result = Repo.query(state, 'users', false)
      .where('age', v => v < 40)
      .get()

    expect(result).toEqual(expected)
  })

  it('can get data of the entity that matches the where query with full callback', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, role: 'admin', age: 20 },
        '2': { id: 2, role: 'user', age: 30 },
        '3': { id: 3, role: 'admin', age: 40 }
      }}
    }

    const expected = [
      { id: 1, role: 'admin', age: 20 },
      { id: 2, role: 'user', age: 30 }
    ]

    const result = Repo.query(state, 'users', false)
      .where(r => r.age < 40)
      .get()

    expect(result).toEqual(expected)
  })

  it('can get data of the entity that matches the where query with a function that accesses variables from outside the scope', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, role: 'admin', age: 20 },
        '2': { id: 2, role: 'user', age: 30 },
        '3': { id: 3, role: 'admin', age: 40 }
      }}
    }

    const expected = [
      { id: 1, role: 'admin', age: 20 },
      { id: 2, role: 'user', age: 30 }
    ]

    const ageAsVariable = 40

    const result = Repo.query(state, 'users', false)
      .where(r => r.age < ageAsVariable)
      .get()

    expect(result).toEqual(expected)
  })

  it('can get data of the entity that matches the where query with nested query builder', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, role: 'admin', age: 20 },
        '2': { id: 2, role: 'user', age: 30 },
        '3': { id: 3, role: 'admin', age: 40 }
      }}
    }

    const expected = [
      { id: 1, role: 'admin', age: 20 }
    ]

    const result = Repo.query(state, 'users', false)
      .where((_user, query) => { query.where('age', 20) })
      .get()

    expect(result).toEqual(expected)
  })

  it('can get data of the entity that matches the where query with complex nested query builder', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, role: 'admin', age: 30 },
        '2': { id: 2, role: 'user', age: 30 },
        '3': { id: 3, role: 'admin', age: 40 },
        '4': { id: 4, role: 'admin', age: 15 }
      }}
    }

    const expected = [
      { id: 1, role: 'admin', age: 30 },
      { id: 4, role: 'admin', age: 15 }
    ]

    const result = Repo.query(state, 'users', false)
      .where('id', 4)
      .orWhere((_user, query) => {
        query.where('age', value => value > 20).where('id', 1)
      })
      .get()

    expect(result).toEqual(expected)
  })

  it('can get data of the entity that matches the orWhere query', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, role: 'admin', age: 20 },
        '2': { id: 2, role: 'user', age: 30 },
        '3': { id: 3, role: 'admin', age: 40 }
      }}
    }

    const expected = [
      { id: 1, role: 'admin', age: 20 },
      { id: 2, role: 'user', age: 30 }
    ]

    const result = Repo.query(state, 'users', false)
      .where(r => r.age === 20)
      .orWhere('role', 'user')
      .get()

    expect(result).toEqual(expected)
  })

  it('can find a single item of entity by id', () => {
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

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(2)
  })

  it('can find a single item by find method chained with query', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1 },
        '2': { id: 2 }
      }}
    }

    const user = Repo.query(state, 'users', false).find(2)

    if (user === null) {
      return t.fail('user is empty but its expected to have 1 record.')
    }

    expect(user).toEqual({ id: 2 })
  })

  it('returns null when single record can not be found', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1 }
      }}
    }

    const user = Repo.find(state, 'users', 2)

    expect(user).toBe(null)
  })

  it('returns empty array when multiple record can not be found', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1 },
        '2': { id: 2 }
      }}
    }

    const users = Repo.query(state, 'users').where('id', 3).get()

    expect(users).toEqual([])
  })

  it('can sort by model fields', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John' },
        '2': { id: 2, name: 'Andy' },
        '3': { id: 3, name: 'Roger' },
        '4': { id: 4, name: 'Andy' }
      }}
    }

    const expected = [
      { id: 4, name: 'Andy' },
      { id: 2, name: 'Andy' },
      { id: 1, name: 'John' },
      { id: 3, name: 'Roger' }
    ]

    const result = Repo.query(state, 'users', false)
      .orderBy('name')
      .orderBy('id', 'desc')
      .get()

    expect(result).toEqual(expected)
  })

  it('can sort by model fields with first method', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John' },
        '2': { id: 2, name: 'Andy' },
        '3': { id: 3, name: 'Roger' }
      }}
    }

    const expected = { id: 2, name: 'Andy' }

    const result = Repo.query(state, 'users', false)
      .orderBy('name')
      .orderBy('id', 'desc')
      .first()

    expect(result).toEqual(expected)
  })

  it('can limit number of records', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John' },
        '2': { id: 2, name: 'Andy' },
        '3': { id: 3, name: 'Roger' },
        '4': { id: 4, name: 'Andy' }
      }}
    }

    const expected = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Andy' }
    ]

    const result = Repo.query(state, 'users', false)
      .limit(2)
      .get()

    expect(result).toEqual(expected)
  })

  it('can limit number of records from an offset', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John' },
        '2': { id: 2, name: 'Andy' },
        '3': { id: 3, name: 'Roger' },
        '4': { id: 4, name: 'Andy' }
      }}
    }

    const expected = [
      { id: 2, name: 'Andy' },
      { id: 3, name: 'Roger' }
    ]

    const result = Repo.query(state, 'users', false)
      .limit(2)
      .offset(1)
      .get()

    expect(result).toEqual(expected)
  })
})
