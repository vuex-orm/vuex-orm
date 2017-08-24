import test from 'ava'
import { schema } from 'normalizr'
import Model from '../Model'

test('Model can create a schema', (t) => {
  class User extends Model {
    static entity = 'users'

    static fields () { return {} }
  }

  t.true(User.schema() instanceof schema.Entity)
})

test('Model can create a list of schema', (t) => {
  class User extends Model {
    static entity = 'users'

    static fields () { return {} }
  }

  t.true(User.schema(true) instanceof schema.Array)
})

test('Model can generate normalized data from single data', (t) => {
  class User extends Model {
    static entity = 'users'

    static fields () { return {} }
  }

  const data = { id: 1, name: 'John Doe' }

  const expected = {
    users: {
      '1': { id: 1, name: 'John Doe' }
    }
  }

  t.deepEqual(User.normalize(data), expected)
})

test('Model can generate normalized data from list of data', (t) => {
  class User extends Model {
    static entity = 'users'

    static fields () { return {} }
  }

  const data = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' }
  ]

  const expected = {
    users: {
      '1': { id: 1, name: 'John Doe' },
      '2': { id: 2, name: 'Jane Doe' }
    }
  }

  t.deepEqual(User.normalize(data), expected)
})

test('Model can generate normalized data with belogns to relation', (t) => {
  class User extends Model {
    static entity = 'users'

    static fields () { return {} }
  }

  class Post extends Model {
    static entity = 'posts'

    static fields () {
      return {
        author: this.belongsTo(User, 'user_id')
      }
    }
  }

  const data = {
    id: 1,
    title: 'Hello, world',
    author: { id: 3, name: 'John Doe' }
  }

  const expected = {
    posts: {
      '1': { id: 1, title: 'Hello, world', author: 3 }
    },

    users: {
      '3': { id: 3, name: 'John Doe' }
    }
  }

  t.deepEqual(Post.normalize(data), expected)
})
