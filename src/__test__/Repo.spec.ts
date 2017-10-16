import test from 'ava'
import { createApplication } from './support/Helpers'
import User from './fixtures/models/User'
import Profile from './fixtures/models/Profile'
import Post from './fixtures/models/Post'
import Comment from './fixtures/models/Comment'
import Repo from '../Repo'

createApplication('entities', [
  { model: User },
  { model: Profile },
  { model: Post },
  { model: Comment }
])

test('Repo can get all data of the entity as class', (t) => {
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

  t.true(users[0] instanceof User)
  t.is(users[0].id, 1)
  t.is(users[1].id, 2)
})

test('Repo can get all data of the entity as plain object', (t) => {
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

  t.deepEqual(Repo.all(state, 'users', false), expected)
})

test('Repo can get all data of the entity that matches the where query', (t) => {
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

  t.deepEqual(result, expected)
})

test('Repo can get single data of the entity that matches the where query', (t) => {
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

  t.deepEqual(result, expected)
})

test('Repo can find a single item of entity by id', (t) => {
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

  t.true(user instanceof User)
  t.is(user.id, 2)
})

test('Repo can resolve has one relation', (t) => {
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

  t.deepEqual(result, expected)
})

test('Repo can resolve belongs to relation', (t) => {
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

  t.deepEqual(result, expected)
})

test('Repo can resolve belongs to relation which its id is 0', (t) => {
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

  t.deepEqual(result, expected)
})

test('Repo can resolve belongs to relation and instantiate the result record', (t) => {
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

  t.true(result instanceof Post)
  t.true(result.author instanceof User)
})

test('Repo can resolve has many relation', (t) => {
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

  t.deepEqual(result, expected)
})

test('Repo can create a single data in Vuex Store', (t) => {
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

  t.deepEqual<any>(state, expected)
})

test('Repo can create a list of data in Vuex Store', (t) => {
  const state = {
    name: 'entities',
    users: { data: {
      '5': { id: 5 }
    }},
    posts: { data: {} },
    comments: { data: {} }
  }

  const data = [
    {
      id: 1,
      author: { id: 10 },
      comments: [{ id: 1, post_id: 1, body: 'C1' }]
    },
    {
      id: 2,
      author: { id: 11 },
      comments: [{ id: 2, post_id: 2, body: 'C2' }, { id: 3, post_id: 2, body: 'C3' }]
    }
  ]

  const expected = {
    name: 'entities',
    users: { data: {
      '10': { id: 10 },
      '11': { id: 11 }
    }},
    posts: { data: {
      '1': { id: 1, user_id: 10, author: 10, comments: [1] },
      '2': { id: 2, user_id: 11, author: 11, comments: [2, 3] }
    }},
    comments: { data: {
      '1': { id: 1, post_id: 1, body: 'C1' },
      '2': { id: 2, post_id: 2, body: 'C2' },
      '3': { id: 3, post_id: 2, body: 'C3' }
    }}
  }

  Repo.create(state, 'posts', data)

  t.deepEqual<any>(state, expected)
})

test('Repo can create with empty data', (t) => {
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
    }}
  }

  Repo.create(state, 'users', [])

  t.deepEqual<any>(state, expected)
})

test('Repo can insert single data to Vuex Store', (t) => {
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

  t.deepEqual<any>(state, expected)
})

test('Repo can insert a list of data to Vuex Store', (t) => {
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

  t.deepEqual<any>(state, expected)
})

test('Repo can insert with empty data', (t) => {
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

  t.deepEqual<any>(state, expected)
})

test('Repo can sort by model fields', (t) => {
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

  t.deepEqual(result, expected)
})
