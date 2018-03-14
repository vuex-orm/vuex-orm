import { createApplication, createState } from 'test/support/Helpers'
import User from 'test/fixtures/models/User'
import Profile from 'test/fixtures/models/Profile'
import Post from 'test/fixtures/models/Post'
import Comment from 'test/fixtures/models/Comment'
import Review from 'test/fixtures/models/Review'
import Like from 'test/fixtures/models/Like'
import CustomKey from 'test/fixtures/models/CustomKey'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Query – Create', () => {
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

  it('can create a single data in Vuex Store', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('John Doe')
        }
      }
    }

    createApplication('entities', [{ model: User }])

    const state = createState('entities', {
      users: {}
    })

    const data = { id: 0, name: 'John Doe' }

    const expected = {
      name: 'entities',
      users: { data: {
        '0': { $id: 0, id: 0, name: 'John Doe' }
      }}
    }

    Query.create(state, 'users', data)

    expect(state).toEqual(expected)
  })

  it('can create a single data with nested object schema in Vuex Store', () => {
    const state = {
      name: 'entities',
      users: { data: {} }
    }

    const data = {
      id: 1,
      settings: {
        role: 'admin'
      }
    }

    const expected = {
      name: 'entities',
      users: { data: {
        '1': {
          $id: 1,
          id: 1,
          name: '',
          settings: {
            role: 'admin',
            accounts: []
          },
          posts: [],
          profile: null
        }
      }}
    }

    Query.create(state, 'users', data)

    expect(state).toEqual(expected)
  })

  it('can create a list of data in Vuex Store', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '5': { id: 5 }
      }},
      posts: { data: {} },
      comments: { data: {} },
      reviews: { data: {} }
    }

    const posts = [
      {
        id: 1,
        user_id: 10,
        author: { id: 10 },
        comments: [{ id: 1, post_id: 1, body: 'C1' }],
        reviews: [1, 2]
      },
      {
        id: 2,
        user_id: 11,
        author: { id: 11 },
        comments: [{ id: 2, post_id: 2, body: 'C2' }, { id: 3, post_id: 2, body: 'C3' }],
        reviews: [3, 4]
      }
    ]

    const expected = {
      name: 'entities',
      users: { data: {
        '10': { $id: 10, id: 10, name: '', settings: { accounts: [], role: '' }, posts: [], profile: null },
        '11': { $id: 11, id: 11, name: '', settings: { accounts: [], role: '' }, posts: [], profile: null }
      }},
      posts: { data: {
        '1': { $id: 1, id: 1, user_id: 10, author: 10, comments: [1], reviews: [1, 2] },
        '2': { $id: 2, id: 2, user_id: 11, author: 11, comments: [2, 3], reviews: [3, 4] }
      }},
      comments: { data: {
        '1': { $id: 1, id: 1, post_id: 1, body: 'C1', post: null, likes: [] },
        '2': { $id: 2, id: 2, post_id: 2, body: 'C2', post: null, likes: [] },
        '3': { $id: 3, id: 3, post_id: 2, body: 'C3', post: null, likes: [] }
      }},
      reviews: { data: {} }
    }

    Query.create(state, 'posts', posts)

    expect(state).toEqual(expected)
  })

  it('can create a list of data and insert specified related entities in Vuex Store', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '5': { id: 5 }
      }},
      posts: { data: {} },
      comments: { data: {} },
      reviews: { data: {} }
    }

    const posts1 = [
      {
        id: 1,
        user_id: 10,
        author: { id: 10 },
        comments: [{ id: 1, post_id: 1, body: 'C1' }],
        reviews: [1, 2]
      }
    ]

    const posts2 = [
      {
        id: 2,
        user_id: 11,
        author: { id: 11 },
        comments: [{ id: 2, post_id: 2, body: 'C2' }, { id: 3, post_id: 2, body: 'C3' }],
        reviews: [3, 4]
      }
    ]

    const expected = {
      name: 'entities',
      users: { data: {
        '10': { $id: 10, id: 10, name: '', settings: { accounts: [], role: '' }, posts: [], profile: null },
        '11': { $id: 11, id: 11, name: '', settings: { accounts: [], role: '' }, posts: [], profile: null }
      }},
      posts: { data: {
        '2': { $id: 2, id: 2, user_id: 11, author: 11, comments: [2, 3], reviews: [3, 4] }
      }},
      comments: { data: {
        '1': { $id: 1, id: 1, post_id: 1, body: 'C1', post: null, likes: [] },
        '2': { $id: 2, id: 2, post_id: 2, body: 'C2', post: null, likes: [] },
        '3': { $id: 3, id: 3, post_id: 2, body: 'C3', post: null, likes: [] }
      }},
      reviews: { data: {} }
    }

    Query.create(state, 'posts', posts1)
    Query.create(state, 'posts', posts2, ['comments', 'users'])

    expect(state).toEqual(expected)
  })

  it('can create data with empty object', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '10': { id: 10 },
        '11': { id: 11 }
      }}
    }

    const expected = {
      name: 'entities',
      users: { data: {} }
    }

    Query.create(state, 'users', [])

    expect(state).toEqual(expected)
  })

  it('can create data with custom primary key', () => {
    const state = {
      name: 'entities',
      customKeys: { data: {} }
    }

    const data = [
      { id: 1, my_id: 10 },
      { id: 2, my_id: 20 }
    ]

    const expected = {
      name: 'entities',
      customKeys: { data: {
        '10': { $id: 10, id: 1, my_id: 10 },
        '20': { $id: 20, id: 2, my_id: 20 }
      }}
    }

    Query.create(state, 'customKeys', data)

    expect(state).toEqual(expected)
  })

  it('can insert single data to Vuex Store', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, name: 'John', settings: { accounts: [], role: '' }, posts: [], profile: null },
        '2': { $id: 2, id: 2, name: 'Jane', settings: { accounts: [], role: '' }, posts: [], profile: null }
      }}
    }

    const data = { id: 3, name: 'Johnny' }

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, name: 'John', settings: { accounts: [], role: '' }, posts: [], profile: null },
        '2': { $id: 2, id: 2, name: 'Jane', settings: { accounts: [], role: '' }, posts: [], profile: null },
        '3': { $id: 3, id: 3, name: 'Johnny', settings: { accounts: [], role: '' }, posts: [], profile: null }
      }}
    }

    Query.insert(state, 'users', data)

    expect(state).toEqual(expected)
  })

  it('can insert a list of data to Vuex Store', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, name: 'John', settings: { accounts: [], role: '' }, posts: [], profile: null },
        '2': { $id: 2, id: 2, name: 'Jane', settings: { accounts: [], role: '' }, posts: [], profile: null }
      }}
    }

    const data = [
      { id: 1, name: 'Janie' },
      { id: 3, name: 'Johnny' }
    ]

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, name: 'Janie', settings: { accounts: [], role: '' }, posts: [], profile: null },
        '2': { $id: 2, id: 2, name: 'Jane', settings: { accounts: [], role: '' }, posts: [], profile: null },
        '3': { $id: 3, id: 3, name: 'Johnny', settings: { accounts: [], role: '' }, posts: [], profile: null }
      }}
    }

    Query.insert(state, 'users', data)

    expect(state).toEqual(expected)
  })

  it('can insert with empty data', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '10': { id: 10 },
        '11': { id: 11 }
      }}
    }

    const expected = {
      name: 'entities',
      users: { data: {
        '10': { id: 10 },
        '11': { id: 11 }
      }}
    }

    Query.insert(state, 'users', [])

    expect(state).toEqual(expected)
  })

  it('can update single data to Vuex Store via insertOrUpdate', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, name: 'John', settings: { accounts: [], role: 'user' }, posts: [], profile: null },
        '2': { $id: 2, id: 2, name: 'Jane', settings: { accounts: [], role: 'admin' }, posts: [], profile: null }
      }}
    }

    const data = { id: 1, name: 'Johnny' }

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, name: 'Johnny', settings: { accounts: [], role: 'user' }, posts: [], profile: null },
        '2': { $id: 2, id: 2, name: 'Jane', settings: { accounts: [], role: 'admin' }, posts: [], profile: null }
      }}
    }

    Query.insertOrUpdate(state, 'users', data)

    expect(state).toEqual(expected)
  })

  it('can insert single data to Vuex Store via insertOrUpdate', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, name: 'John', settings: { accounts: [], role: 'user' }, posts: [], profile: null },
        '2': { $id: 2, id: 2, name: 'Jane', settings: { accounts: [], role: 'admin' }, posts: [], profile: null }
      }}
    }

    const data = { id: 3, name: 'Peter' }

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, name: 'John', settings: { accounts: [], role: 'user' }, posts: [], profile: null },
        '2': { $id: 2, id: 2, name: 'Jane', settings: { accounts: [], role: 'admin' }, posts: [], profile: null },
        '3': { $id: 3, id: 3, name: 'Peter', settings: { accounts: [], role: '' }, posts: [], profile: null }
      }}
    }

    Query.insertOrUpdate(state, 'users', data)

    expect(state).toEqual(expected)
  })

  it('can insertOrUpdate a list of data to Vuex Store', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, name: 'John', settings: { accounts: [], role: 'user' }, posts: [], profile: null },
        '2': { $id: 2, id: 2, name: 'Jane', settings: { accounts: [], role: 'admin' }, posts: [], profile: null }
      }}
    }

    const data = [
      { id: 1, name: 'Janie' },
      { id: 3, name: 'Johnny', settings: { role: 'user' } }
    ]

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, name: 'Janie', settings: { accounts: [], role: 'user' }, posts: [], profile: null },
        '2': { $id: 2, id: 2, name: 'Jane', settings: { accounts: [], role: 'admin' }, posts: [], profile: null },
        '3': { $id: 3, id: 3, name: 'Johnny', settings: { accounts: [], role: 'user' }, posts: [], profile: null }
      }}
    }

    Query.insertOrUpdate(state, 'users', data)

    expect(state).toEqual(expected)
  })

  it('can insertOrUpdate with empty data', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '10': { id: 10 },
        '11': { id: 11 }
      }}
    }

    const expected = {
      name: 'entities',
      users: { data: {
        '10': { id: 10 },
        '11': { id: 11 }
      }}
    }

    Query.insertOrUpdate(state, 'users', [])

    expect(state).toEqual(expected)
  })
})
