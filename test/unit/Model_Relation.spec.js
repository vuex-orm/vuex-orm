import { createApplication } from 'test/support/Helpers'
import Model from 'app/Model'

describe('Model: Relation', () => {
  it('can resolve has one relation', () => {
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

    const data = {
      id: 1,
      profile: { id: 3, user_id: 1 }
    }

    const user = new User(data)

    expect(user.id).toBe(1)

    expect(user.profile).toBeInstanceOf(Profile)
    expect(user.profile.id).toBe(3)
  })

  it('can resolve belongs to relation', () => {
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
          user_id: this.attr(null),
          author: this.belongsTo(User, 'user_id')
        }
      }
    }

    const data = {
      id: 1,
      user_id: 3,
      author: { id: 3 }
    }

    const post = new Post(data)

    expect(post.id).toBe(1)

    expect(post.author).toBeInstanceOf(User)
    expect(post.author.id).toBe(3)
  })

  it('can resolve has many relation', () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.hasMany(Comment, 'post_id')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      static fields () {
        return {
          id: this.attr(null),
          post_id: this.attr(null)
        }
      }
    }

    const data = {
      id: 1,
      comments: [
        { id: 1, post_id: 1 },
        { id: 2, post_id: 1 }
      ]
    }

    const post = new Post(data)

    expect(post.id).toBe(1)

    expect(post.comments.length).toBe(2)
    expect(post.comments[0]).toBeInstanceOf(Comment)
    expect(post.comments[1]).toBeInstanceOf(Comment)
    expect(post.comments[0].id).toBe(1)
    expect(post.comments[1].id).toBe(2)
  })

  it('can resolve has many by relation', () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.hasManyBy(Comment, 'comments')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    const data = {
      id: 1,
      comments: [
        { id: 1, post_id: 1 },
        { id: 2, post_id: 1 }
      ]
    }

    const post = new Post(data)

    expect(post).toBeInstanceOf(Post)
    expect(post.comments[0]).toBeInstanceOf(Comment)
    expect(post.comments[1]).toBeInstanceOf(Comment)
    expect(post.comments[0].id).toBe(1)
    expect(post.comments[1].id).toBe(2)
  })

  it('can resolve a nested relation', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          settings: {
            accounts: this.hasMany(Account, 'user_id')
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

    const data = {
      id: 1,
      settings: {
        accounts: [
          { id: 3, user_id: 1 },
          { id: 4, user_id: 1 }
        ]
      }
    }

    const user = new User(data)

    expect(user).toBeInstanceOf(User)
    expect(user.settings.accounts[0]).toBeInstanceOf(Account)
    expect(user.settings.accounts[1]).toBeInstanceOf(Account)
    expect(user.settings.accounts[0].id).toBe(3)
    expect(user.settings.accounts[1].id).toBe(4)
  })
})
