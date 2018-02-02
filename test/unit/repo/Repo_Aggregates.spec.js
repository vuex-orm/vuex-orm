import { createApplication } from 'test/support/Helpers'
import User from 'test/fixtures/models/User'
import Repo from 'app/repo/Repo'

describe('Repo – Aggregates', () => {
  beforeEach(() => {
    createApplication('entities', [
      { model: User }
    ])
  })

  it('can get count of the data', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, role: 'admin' },
        '2': { id: 2, role: 'user' },
        '3': { id: 3, role: 'admin' }
      }}
    }

    expect(Repo.count(state, 'users')).toBe(3)
    expect(Repo.query(state, 'users').count()).toBe(3)
    expect(Repo.query(state, 'users').where('role', 'admin').count()).toBe(2)
  })

  it('can get max value of the specified field', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 8, role: 'admin' },
        '2': { id: 12, role: 'user' },
        '3': { id: 11, role: 'admin' }
      }}
    }

    expect(Repo.max(state, 'users', 'id')).toBe(12)
    expect(Repo.query(state, 'users').max('id')).toBe(12)
    expect(Repo.query(state, 'users').where('role', 'admin').max('id')).toBe(11)
  })

  it('can get min value of the specified field', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 8, role: 'admin' },
        '2': { id: 12, role: 'user' },
        '3': { id: 11, role: 'admin' }
      }}
    }

    expect(Repo.min(state, 'users', 'id')).toBe(8)
    expect(Repo.query(state, 'users').min('id')).toBe(8)
    expect(Repo.query(state, 'users').where('role', 'admin').min('id')).toBe(8)
  })
})
