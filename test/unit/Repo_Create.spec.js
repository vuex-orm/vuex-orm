import { createApplication } from 'test/support/Helpers'
import User from 'test/fixtures/models/User'
import Profile from 'test/fixtures/models/Profile'
import Post from 'test/fixtures/models/Post'
import Comment from 'test/fixtures/models/Comment'
import Review from 'test/fixtures/models/Review'
import Like from 'test/fixtures/models/Like'
import CustomKey from 'test/fixtures/models/CustomKey'
import Repo from 'app/Repo'

describe('Repo: Create', () => {
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
    const state = {
      name: 'entities',
      posts: { data: {} },
      comments: { data: {} }
    }

    const data = {
      id: 0,
      comments: [
        { id: 0, post_id: 0 },
        { id: 1, post_id: 0 }
      ]
    }

    const expected = {
      name: 'entities',
      posts: { data: {
        '0': {
          id: 0,
          user_id: null,
          author: null,
          comments: [0, 1],
          reviews: []
        }
      }},
      comments: { data: {
        '0': { id: 0, post_id: 0, body: '', post: null, likes: [] },
        '1': { id: 1, post_id: 0, body: '', post: null, likes: [] }
      }}
    }

    Repo.create(state, 'posts', data)

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

    Repo.create(state, 'users', data)

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
        author: { id: 10 },
        comments: [{ id: 1, post_id: 1, body: 'C1' }],
        reviews: [1, 2]
      },
      {
        id: 2,
        author: { id: 11 },
        comments: [{ id: 2, post_id: 2, body: 'C2' }, { id: 3, post_id: 2, body: 'C3' }],
        reviews: [3, 4]
      }
    ]

    const expected = {
      name: 'entities',
      users: { data: {
        '10': { id: 10, name: '', settings: { accounts: [], role: '' }, posts: [], profile: null },
        '11': { id: 11, name: '', settings: { accounts: [], role: '' }, posts: [], profile: null }
      }},
      posts: { data: {
        '1': { id: 1, user_id: 10, author: 10, comments: [1], reviews: [1, 2] },
        '2': { id: 2, user_id: 11, author: 11, comments: [2, 3], reviews: [3, 4] }
      }},
      comments: { data: {
        '1': { id: 1, post_id: 1, body: 'C1', post: null, likes: [] },
        '2': { id: 2, post_id: 2, body: 'C2', post: null, likes: [] },
        '3': { id: 3, post_id: 2, body: 'C3', post: null, likes: [] }
      }},
      reviews: { data: {} }
    }

    Repo.create(state, 'posts', posts)

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

    Repo.create(state, 'users', [])

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
        '10': { id: 1, my_id: 10 },
        '20': { id: 2, my_id: 20 }
      }}
    }

    Repo.create(state, 'customKeys', data)

    expect(state).toEqual(expected)
  })

  it('can insert single data to Vuex Store', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John', settings: { accounts: [], role: '' }, posts: [], profile: null },
        '2': { id: 2, name: 'Jane', settings: { accounts: [], role: '' }, posts: [], profile: null }
      }}
    }

    const data = { id: 3, name: 'Johnny' }

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John', settings: { accounts: [], role: '' }, posts: [], profile: null },
        '2': { id: 2, name: 'Jane', settings: { accounts: [], role: '' }, posts: [], profile: null },
        '3': { id: 3, name: 'Johnny', settings: { accounts: [], role: '' }, posts: [], profile: null }
      }}
    }

    Repo.insert(state, 'users', data)

    expect(state).toEqual(expected)
  })

  it('can insert a list of data to Vuex Store', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John', settings: { accounts: [], role: '' }, posts: [], profile: null },
        '2': { id: 2, name: 'Jane', settings: { accounts: [], role: '' }, posts: [], profile: null }
      }}
    }

    const data = [
      { id: 1, name: 'Janie' },
      { id: 3, name: 'Johnny' }
    ]

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'Janie', settings: { accounts: [], role: '' }, posts: [], profile: null },
        '2': { id: 2, name: 'Jane', settings: { accounts: [], role: '' }, posts: [], profile: null },
        '3': { id: 3, name: 'Johnny', settings: { accounts: [], role: '' }, posts: [], profile: null }
      }}
    }

    Repo.insert(state, 'users', data)

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

    Repo.insert(state, 'users', [])

    expect(state).toEqual(expected)
  })
})
