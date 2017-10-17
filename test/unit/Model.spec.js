import { createApplication } from 'test/support/Helpers'
import moment from 'moment'
import { schema } from 'normalizr'
import Model from 'app/Model'

describe('Model', () => {
  it('can create a schema', () => {
    class User extends Model {
      static entity = 'users'

      static fields () { return {} }
    }

    expect(User.schema()).toBeInstanceOf(schema.Entity)
  })

  it('can create a list of schema', () => {
    class User extends Model {
      static entity = 'users'

      static fields () { return {} }
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
        '1': { id: 1, name: 'John Doe' }
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
        '1': { id: 1, name: 'John Doe' },
        '2': { id: 2, name: 'Jane Doe' }
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
        '1': { id: 1, title: 'Hello, world', user_id: 3, author: 3 }
      },

      users: {
        '3': { id: 3, name: 'John Doe' }
      }
    }

    expect(Post.normalize(data)).toEqual(expected)
  })

  it('should set default field values as a property on instanciation', () => {
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

    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john@example.com')
  })

  it('should set given field values as a property on instanciation', () => {
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

    expect(user.name).toBe('Jane Doe')
    expect(user.email).toBe('john@example.com')
    expect(user.age).toBe(undefined)
  })

  it('can resolve has one relation', () => {
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

    expect(user.name).toBe('John Doe')

    expect(user.profile).toBeInstanceOf(Profile)
    expect(user.profile.sex).toBe('male')
  })

  it('can resolve belongs to relation', () => {
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

    expect(post.title).toBe('Hello, world!')

    expect(post.author).toBeInstanceOf(User)
    expect(post.author.name).toBe('Jane Doe')
    expect(post.author.email).toBe('jane@example.com')
  })

  it('can resolve has many relation', () => {
    class Comment extends Model {
      static entity = 'comments'

      static fields () {
        return {
          id: this.attr(null),
          post_id: this.attr(null),
          body: this.attr('')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          title: this.attr(''),
          comments: this.hasMany(Comment, 'post_id')
        }
      }
    }

    const data = {
      id: 1,
      title: 'Post title',
      comments: [
        { id: 1, post_id: 1, body: 'Comment 01' },
        { id: 2, post_id: 2, body: 'Comment 02' }
      ]
    }

    const post = new Post(data)

    expect(post.title).toBe('Post title')

    expect(post.comments.length).toBe(2)
    expect(post.comments[0]).toBeInstanceOf(Comment)
    expect(post.comments[1]).toBeInstanceOf(Comment)
    expect(post.comments[0].body).toBe('Comment 01')
    expect(post.comments[1].body).toBe('Comment 02')
  })

  it('can cast date attributes to moment instance', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          created_at: this.date(null)
        }
      }
    }

    const user = new User({ created_at: '1985-10-10 00:10:20' })

    expect(moment.isMoment(user.created_at)).toBe(true)
    expect(user.created_at.format('MMM D, YYYY')).toBe('Oct 10, 1985')
  })

  it('can serialize own fields into json', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('John Doe')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      static fields () {
        return {
          id: this.attr(null),
          post_id: this.attr(null),
          body: this.attr('')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          title: this.attr(''),
          created_at: this.date(null),
          author: this.belongsTo(User, 'user_id'),
          comments: this.hasMany(Comment, 'post_id')
        }
      }
    }

    const data = {
      id: 1,
      title: 'Post Title',
      user_id: 1,
      created_at: '1985-10-10 00:10:20',
      author: { id: 1, name: 'John' },
      comments: [
        { id: 1, post_id: 1, body: 'C1' },
        { id: 2, post_id: 1, body: 'C2' }
      ]
    }

    const expected = { ...data, created_at: '1985-10-09T15:10:20.000Z' }

    const post = new Post(data)

    expect(post.$toJson()).toEqual(expected)
  })
})
