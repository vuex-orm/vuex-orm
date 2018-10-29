import Model from 'app/model/Model'

describe('Model – Relations', () => {
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

  it('can resolve empty has many relation', () => {
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
      comments: []
    }

    const post = new Post(data)

    expect(post).toBeInstanceOf(Post)
    expect(post.id).toBe(1)
    expect(post.comments).not.toBeNull()
    expect(post.comments).toBeInstanceOf(Array)
    expect(post.comments.length).toBe(0)
  })

  it('can resolve empty has many by relation', () => {
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
      comments: []
    }

    const post = new Post(data)

    expect(post).toBeInstanceOf(Post)
    expect(post.id).toBe(1)
    expect(post.comments).not.toBeNull()
    expect(post.comments).toBeInstanceOf(Array)
    expect(post.comments.length).toBe(0)
  })
})
