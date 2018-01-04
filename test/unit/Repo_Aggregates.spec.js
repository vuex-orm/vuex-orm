import { createApplication } from 'test/support/Helpers'
import User from 'test/fixtures/models/User'
import Repo from 'app/Repo'

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
})
