import test from 'ava'
import { createApplication } from './support/Helpers'
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

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  createApplication('entities', [{ model: User }])

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

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  createApplication('entities', [{ model: User }])

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

    static fields () {
      return {
        id: this.attr(null)
      }
    }
  }

  class Post extends Model {
    static entity = 'posts'

    static fields () {
      return {
        id: this.attr(null),
        author: this.belongsTo(User, 'user_id')
      }
    }
  }

  createApplication('entities', [{ model: User }, { model: Post }])

  const data = {
    id: 1,
    title: 'Hello, world',
    author: { id: 3, name: 'John Doe' }
  }

  const expected = {
    posts: {
      '1': { id: 1, title: 'Hello, world', user_id: 3, author: 3 }
    },

    users: {
      '3': { id: 3, name: 'John Doe' }
    }
  }

  t.deepEqual(Post.normalize(data), expected)
})

test('Model should set default field values as a property on instanciation', (t) => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        name: this.attr('John Doe'),
        email: this.attr('john@example.com')
      }
    }
  }

  const user = new User()

  t.is(user.name, 'John Doe')
  t.is(user.email, 'john@example.com')
})

test('Model should set given field values as a property on instanciation', (t) => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        name: this.attr('John Doe'),
        email: this.attr('john@example.com')
      }
    }
  }

  const user = new User({ name: 'Jane Doe', age: 32 })

  t.is(user.name, 'Jane Doe')
  t.is(user.email, 'john@example.com')
  t.is(user.age, undefined)
})

test('Model can resolve has one relation', (t) => {
  class Profile extends Model {
    static entity = 'profiles'

    static fields () {
      return {
        id: this.attr(null),
        user_id: this.attr(null),
        sex: this.attr('')
      }
    }
  }

  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('John Doe'),
        profile: this.hasOne(Profile, 'user_id')
      }
    }
  }

  const data = {
    id: 1,
    name: 'John Doe',
    profile: {
      id: 1,
      user_id: 1,
      sex: 'male'
    }
  }

  const user = new User(data)

  t.is(user.name, 'John Doe')

  t.true(user.profile instanceof Profile)
  t.is(user.profile.sex, 'male')
})

test('Model can resolve belongs to relation', (t) => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        name: this.attr('John Doe'),
        email: this.attr('john@example.com')
      }
    }
  }

  class Post extends Model {
    static entity = 'posts'

    static fields () {
      return {
        title: this.attr(''),
        author: this.belongsTo(User, 'user_id')
      }
    }
  }

  const data = {
    title: 'Hello, world!',
    author: {
      name: 'Jane Doe',
      email: 'jane@example.com'
    }
  }

  const post = new Post(data)

  t.is(post.title, 'Hello, world!')

  t.true(post.author instanceof User)
  t.is(post.author.name, 'Jane Doe')
  t.is(post.author.email, 'jane@example.com')
})
