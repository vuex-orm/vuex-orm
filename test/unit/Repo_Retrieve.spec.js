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

describe('Repo: Retrieve', () => {
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

  it('can resolve has one relation', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, profile: 3 }
      }},
      profiles: { data: {
        '3': { id: 3, user_id: 1, users: 1 }
      }}
    }

    const expected = {
      id: 1,
      profile: {
        id: 3,
        user_id: 1,
        users: 1
      }
    }

    const result = Repo.query(state, 'users', false).with('profile').first()

    expect(result).toEqual(expected)
  })

  it('can resolve belongs to relation', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John Doe' }
      }},
      posts: { data: {
        '3': { id: 3, user_id: 1, author: 1 }
      }}
    }

    const expected = {
      id: 3,
      user_id: 1,
      author: {
        id: 1,
        name: 'John Doe'
      }
    }

    const result = Repo.query(state, 'posts', false).with('author').first()

    expect(result).toEqual(expected)
  })

  it('can resolve belongs to relation which its id is 0', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '0': { id: 0, name: 'John Doe' }
      }},
      posts: { data: {
        '3': { id: 3, user_id: 0, author: 0 }
      }}
    }

    const expected = {
      id: 3,
      user_id: 0,
      author: {
        id: 0,
        name: 'John Doe'
      }
    }

    const result = Repo.query(state, 'posts', false).with('author').first()

    expect(result).toEqual(expected)
  })

  it('can resolve belongs to relation with custom foreign key', () => {
    const state = {
      name: 'entities',
      clusters: { data: {
       '1': { id: 1, name: 'tokyo', nodes: [1] }
      }},
      nodes: { data: {
       '1': { id: 1, name: 'one', clusterId: 1 },
       '2': { id: 2, name: 'two', clusterId: null }
      }}
    }

    const nodes = Repo.query(state, 'nodes', false).with('cluster').get()

    const expected = [
      { id: 1, name: 'one', clusterId: 1, cluster: { id: 1, name: 'tokyo', nodes: [1] } },
      { id: 2, name: 'two', clusterId: null, cluster: null },
    ]

    expect(nodes).toEqual(expected)
  })

  it('can resolve belongs to relation and instantiate the result record', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John Doe' }
      }},
      posts: { data: {
        '3': { id: 3, user_id: 1, author: 1 }
      }}
    }

    const result = Repo.query(state, 'posts').with('author').first()

    if (result === null || result.author === null) {
      return t.fail('The result is expected to be not null.')
    }

    expect(result).toBeInstanceOf(Post)
    expect(result.author).toBeInstanceOf(User)
  })

  it('can resolve has many relation', () => {
    const state = {
      name: 'entities',
      posts: { data: {
        '1': { id: 1, title: 'Post Title', comments: [] }
      }},
      comments: { data: {
        '1': { id: 1, post_id: 1, body: 'Comment 01' },
        '2': { id: 2, post_id: 2, body: 'Comment 02' },
        '3': { id: 2, post_id: 1, body: 'Comment 03' }
      }}
    }

    const expected = {
      id: 1,
      title: 'Post Title',
      comments: [
        { id: 1, post_id: 1, body: 'Comment 01' },
        { id: 2, post_id: 1, body: 'Comment 03' }
      ]
    }

    const result = Repo.query(state, 'posts', false).with('comments').first()

    expect(result).toEqual(expected)
  })

  it('can resolve has many by relation', () => {
    const state = {
      name: 'entities',
      posts: { data: {
        '1': { id: 1, title: 'Post Title', reviews: [1, 2] }
      }},
      reviews: { data: {
        '1': { id: 1 },
        '2': { id: 2 }
      }}
    }

    const expected = {
      id: 1,
      title: 'Post Title',
      reviews: [{ id: 1 }, { id: 2 }]
    }

    const post = Repo.query(state, 'posts').with('reviews').first()

    expect(post).toBeInstanceOf(Post)
    expect(post.reviews.length).toBe(2)
    expect(post.reviews[0]).toBeInstanceOf(Review)
  })

  it('can resolve relation constraint', () => {
    const state = {
      name: 'entities',
      posts: { data: {
        '1': { id: 1, title: 'Post Title', comments: [1, 2, 3] }
      }},
      comments: { data: {
        '1': { id: 1, post_id: 1, type: 'review' },
        '2': { id: 2, post_id: 1, type: 'comment' },
        '3': { id: 3, post_id: 1, type: 'review' }
      }}
    }

    const expected = {
      id: 1,
      title: 'Post Title',
      comments: [
        { id: 1, post_id: 1, type: 'review' },
        { id: 3, post_id: 1, type: 'review' }
      ]
    }

    const post = Repo.query(state, 'posts', false).with('comments', (query) => {
      query.where('type', 'review')
    }).first()

    expect(post).toEqual(expected)
  })

  it('can resolve nested relation', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, settings: { accounts: [1, 2] } }
      }},
      accounts: { data: {
        '1': { id: 1, user_id: 1 },
        '2': { id: 2, user_id: 1 },
        '3': { id: 3, user_id: 2 }
      }}
    }

    const expected = {
      id: 1,
      settings: {
        accounts: [
          { id: 1, user_id: 1 },
          { id: 2, user_id: 1 }
        ]
      }
    }

    const post = Repo.query(state, 'users', false).with('accounts').first()

    expect(post).toEqual(expected)
  })

  it('can resolve nested relation with where clouse', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, settings: { accounts: [1, 2] } }
      }},
      accounts: { data: {
        '1': { id: 1, user_id: 1 },
        '2': { id: 2, user_id: 1 },
        '3': { id: 3, user_id: 2 }
      }}
    }

    const expected = [{
      id: 1,
      settings: {
        accounts: [
          { id: 2, user_id: 1 }
        ]
      }
    }]

    const post = Repo.query(state, 'users', false)
      .with('accounts', query => { query.where('id', 2) })
      .get()

    expect(post).toEqual(expected)
  })
})
