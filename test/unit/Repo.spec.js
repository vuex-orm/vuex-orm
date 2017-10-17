import { createApplication } from 'test/support/Helpers'
import User from 'test/fixtures/models/User'
import Profile from 'test/fixtures/models/Profile'
import Post from 'test/fixtures/models/Post'
import Comment from 'test/fixtures/models/Comment'
import Review from 'test/fixtures/models/Review'
import CustomKey from 'test/fixtures/models/CustomKey'
import Repo from 'app/Repo'

describe('Repo', () => {
  beforeEach(() => {
    createApplication('entities', [
      { model: User },
      { model: Profile },
      { model: Post },
      { model: Comment },
      { model: Review },
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

  it('can create a single data in Vuex Store', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '5': { id: 5 }
      }},
      posts: { data: {} }
    }

    const data = { id: 1, author: { id: 10 } }

    const expected = {
      name: 'entities',
      users: { data: {
        '10': { id: 10 }
      }},
      posts: { data: {
        '1': { id: 1, user_id: 10, author: 10 }
      }}
    }

    Repo.create(state, 'posts', data)

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
        '10': { id: 10 },
        '11': { id: 11 }
      }},
      posts: { data: {
        '1': { id: 1, user_id: 10, author: 10, comments: [1], reviews: [1, 2] },
        '2': { id: 2, user_id: 11, author: 11, comments: [2, 3], reviews: [3, 4] }
      }},
      comments: { data: {
        '1': { id: 1, post_id: 1, body: 'C1' },
        '2': { id: 2, post_id: 2, body: 'C2' },
        '3': { id: 3, post_id: 2, body: 'C3' }
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
        '1': { id: 1, name: 'John' },
        '2': { id: 2, name: 'Jane' }
      }}
    }

    const data = { id: 3, name: 'Johnny' }

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John' },
        '2': { id: 2, name: 'Jane' },
        '3': { id: 3, name: 'Johnny' }
      }}
    }

    Repo.insert(state, 'users', data)

    expect(state).toEqual(expected)
  })

  it('can insert a list of data to Vuex Store', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John' },
        '2': { id: 2, name: 'Jane' }
      }}
    }

    const data = [
      { id: 1, name: 'Janie' },
      { id: 3, name: 'Johnny' }
    ]

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'Janie' },
        '2': { id: 2, name: 'Jane' },
        '3': { id: 3, name: 'Johnny' }
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
})

