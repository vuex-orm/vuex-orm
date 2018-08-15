import { createStore } from 'test/support/Helpers'
import User from 'test/fixtures/models/User'
import Query from 'app/query/Query'

describe('Query – Aggregates', () => {
  beforeEach(() => {
    createStore([{ model: User }])
  })

  it('can get count of the data', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { id: 1, role: 'admin' },
        '2': { id: 2, role: 'user' },
        '3': { id: 3, role: 'admin' }
      }}
    }

    expect(Query.count(state, 'users')).toBe(3)
    expect(Query.query(state, 'users').count()).toBe(3)
    expect(Query.query(state, 'users').where('role', 'admin').count()).toBe(2)
  })

  it('can get max value of the specified field', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { id: 8, role: 'admin' },
        '2': { id: 12, role: 'user' },
        '3': { id: 11, role: 'admin' },
        '4': { id: 'A', role: 'admin' }
      }}
    }

    expect(Query.max(state, 'users', 'id')).toBe(12)
    expect(Query.query(state, 'users').max('id')).toBe(12)
    expect(Query.query(state, 'users').where('role', 'admin').max('id')).toBe(11)
  })

  it('can get min value of the specified field', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { id: 8, role: 'admin' },
        '2': { id: 12, role: 'user' },
        '3': { id: 11, role: 'admin' },
        '4': { id: 'A', role: 'admin' }
      }}
    }

    expect(Query.min(state, 'users', 'id')).toBe(8)
    expect(Query.query(state, 'users').min('id')).toBe(8)
    expect(Query.query(state, 'users').where('role', 'admin').min('id')).toBe(8)
  })

  it('can get sum value of the specified field', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { id: 8, role: 'admin' },
        '2': { id: 12, role: 'user' },
        '3': { id: 11, role: 'admin' },
        '4': { id: 'A', role: 'admin' }
      }}
    }

    expect(Query.sum(state, 'users', 'id')).toBe(31)
    expect(Query.query(state, 'users').sum('id')).toBe(31)
    expect(Query.query(state, 'users').where('role', 'admin').sum('id')).toBe(19)
  })
})
