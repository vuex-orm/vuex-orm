import { createApplication } from 'test/support/Helpers'
import User from 'test/fixtures/models/User'
import Profile from 'test/fixtures/models/Profile'
import Post from 'test/fixtures/models/Post'
import Comment from 'test/fixtures/models/Comment'
import Review from 'test/fixtures/models/Review'
import Like from 'test/fixtures/models/Like'
import CustomKey from 'test/fixtures/models/CustomKey'
import Repo from 'app/Repo'

describe('Repo – Update', () => {
  beforeEach(() => {
    createApplication('entities', [
      { model: User },
      { model: Profile },
      { model: Post },
      { model: Comment },
      { model: Review },
      { model: Like },
      { model: CustomKey }
    ])
  })

  it('can update record by including primary key in the data', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John', age: 20 },
        '2': { id: 2, name: 'Jane', age: 30 }
      }}
    }

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John', age: 20 },
        '2': { id: 2, name: 'Jane', age: 24 }
      }}
    }

    Repo.update(state, 'users', { id: 2, age: 24 })
    Repo.update(state, 'users', { id: 3, age: 24 })

    expect(state).toEqual(expected)
  })

  it('can update record by specifying condition with id', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John', age: 20 },
        '2': { id: 2, name: 'Jane', age: 30 }
      }}
    }

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John', age: 20 },
        '2': { id: 2, name: 'Jane', age: 24 }
      }}
    }

    Repo.update(state, 'users', { age: 24 }, 2)
    Repo.update(state, 'users', { age: 24 }, 3)

    expect(state).toEqual(expected)
  })

  it('can update record by specifying condition with closure', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John', age: 20 },
        '2': { id: 2, name: 'Jane', age: 30 }
      }}
    }

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John', age: 20 },
        '2': { id: 2, name: 'Jane', age: 24 }
      }}
    }

    Repo.update(state, 'users', { age: 24 }, record => record.name === 'Jane')
    Repo.update(state, 'users', { age: 24 }, record => record.id === 3)

    expect(state).toEqual(expected)
  })
})
