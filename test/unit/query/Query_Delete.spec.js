import { createApplication } from 'test/support/Helpers'
import User from 'test/fixtures/models/User'
import Profile from 'test/fixtures/models/Profile'
import Post from 'test/fixtures/models/Post'
import Comment from 'test/fixtures/models/Comment'
import Review from 'test/fixtures/models/Review'
import Like from 'test/fixtures/models/Like'
import CustomKey from 'test/fixtures/models/CustomKey'
import Query from 'app/query/Query'

describe('Query – Delete', () => {
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

  it('can delete record by id', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { id: 1 },
        '2': { id: 2 }
      }}
    }

    const expected = {
      $name: 'entities',
      users: { data: {
        '2': { id: 2 }
      }}
    }

    Query.delete(state, 'users', 1)

    expect(state).toEqual(expected)
  })

  it('can delete record by string key', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { id: 1 },
        '2': { id: 2 }
      }}
    }

    const expected = {
      $name: 'entities',
      users: { data: {
        '2': { id: 2 }
      }}
    }

    Query.delete(state, 'users', '1')

    expect(state).toEqual(expected)
  })

  it('can delete record by closure', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John' },
        '2': { id: 2, name: 'Jane' },
        '3': { id: 3, name: 'George' }
      }}
    }

    const expected = {
      $name: 'entities',
      users: { data: {
        '3': { id: 3, name: 'George' }
      }}
    }

    Query.delete(state, 'users', (record) => {
      return record.id === 1 || record.name === 'Jane'
    })

    expect(state).toEqual(expected)
  })

  it('can delete all records for an entity', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John' },
        '2': { id: 2, name: 'Jane' },
        '3': { id: 3, name: 'George' }
      }}
    }

    const expected = {
      $name: 'entities',
      users: {
        data: {}
      }
    }

    Query.deleteAll(state, 'users')

    expect(state).toEqual(expected)
  })

  it('can delete all records for all entities', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John' },
        '2': { id: 2, name: 'Jane' },
        '3': { id: 3, name: 'George' }
      }},
      posts: {
        data: {
          '1': { id: 1, user_id: 1 },
          '2': { id: 2, user_id: 2 },
          '3': { id: 3, user_id: 3 },
        }
      }
    }

    const expected = {
      $name: 'entities',
      users: {
        data: {}
      },
      posts: {
        data: {}
      }
    }

    Query.deleteAll(state)

    expect(state).toEqual(expected)
  })
})
