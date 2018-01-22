import { createApplication } from 'test/support/Helpers'
import { schema } from 'normalizr'
import Model from 'app/Model'

describe('Model – Normalization', () => {
  it('can create a schema', () => {
    class User extends Model {
      static entity = 'users'
    }

    expect(User.schema()).toBeInstanceOf(schema.Entity)
  })

  it('can create a list of schema', () => {
    class User extends Model {
      static entity = 'users'
    }

    expect(User.schema(true)).toBeInstanceOf(schema.Array)
  })

  it('can generate normalized data from single data', () => {
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
        '1': { $id: 1, id: 1, name: 'John Doe' }
      }
    }

    expect(User.normalize(data)).toEqual(expected)
  })

  it('can generate normalized data from list of data', () => {
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
        '1': { $id: 1, id: 1, name: 'John Doe' },
        '2': { $id: 2, id: 2, name: 'Jane Doe' }
      }
    }

    expect(User.normalize(data)).toEqual(expected)
  })

  it('can generate normalized data with has one relation', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          profile: this.hasOne(Profile, 'user_id')
        }
      }
    }

    class Profile extends Model {
      static entity = 'profiles'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: User }, { model: Profile }])

    const data = {
      id: 1,
      profile: { id: 3 }
    }

    const expected = {
      users: {
        '1': { $id: 1, id: 1, profile: 3 }
      },
      profiles: {
        '3': { $id: 3, id: 3 }
      }
    }

    expect(User.normalize(data)).toEqual(expected)
  })

  it('can generate normalized data with belogns to relation', () => {
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
        '1': { $id: 1, id: 1, title: 'Hello, world', user_id: 3, author: 3 }
      },
      users: {
        '3': { $id: 3, id: 3, name: 'John Doe' }
      }
    }

    expect(Post.normalize(data)).toEqual(expected)
  })

  it('can generate normalized data with has many relation', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
        }
      }
    }

    createApplication('entities', [{ model: User }, { model: Post }])

    const data = { id: 1, posts: [{ id: 3, user_id: 1 }, { id: 5, user_id: 1 }]}

    const expected = {
      posts: {
        '3': { $id: 3, id: 3, user_id: 1 },
        '5': { $id: 5, id: 5, user_id: 1 }
      },
      users: {
        '1': { $id: 1, id: 1, posts: [3, 5] }
      }
    }

    expect(User.normalize(data)).toEqual(expected)
  })

  it('can generate normalized data with has many by relation', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          posts: this.hasManyBy(Post, 'posts')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: User }, { model: Post }])

    const data = { id: 1, posts: [3, 5]}

    const expected = {
      users: {
        '1': { $id: 1, id: 1, posts: [3, 5] }
      }
    }

    expect(User.normalize(data)).toEqual(expected)
  })

  it('can generate normalized data with nested schema', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          settings: {
            type: this.attr(0),
            account: this.hasOne(Account, 'user_id')
          }
        }
      }
    }

    class Account extends Model {
      static entity = 'accounts'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: User }, { model: Account }])

    const data = {
      id: 1,
      settings: {
        type: 1,
        account: { id: 2, user_id: 1 }
      }
    }

    const expected = {
      users: {
        '1': {
          $id: 1,
          id: 1,
          settings: { type: 1, account: 2 }
        }
      },
      accounts: {
        '2': { $id: 2, id: 2, user_id: 1 }
      }
    }

    expect(User.normalize(data)).toEqual(expected)
  })
})
