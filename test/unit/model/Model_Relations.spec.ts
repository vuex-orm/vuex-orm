import Model from '@/model/Model'

describe('Model – Relations', () => {
  it('can resolve has one relation', () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @HasOne(Profile, 'user_id')
      profile!: Profile

      static fields () {
        return {
          id: this.attr(null),
          profile: this.hasOne(Profile, 'user_id')
        }
      }
    }

    class Profile extends Model {
      static entity = 'profiles'

      // @Attribute
      id!: number

      // @Attribute
      user_id!: number

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const user = new User({
      id: 1,
      profile: { id: 3, user_id: 1 }
    })

    expect(user.id).toBe(1)

    expect(user.profile).toBeInstanceOf(Profile)
    expect(user.profile.id).toBe(3)
  })

  it('can resolve belongs to relation', () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @Attribute
      user_id!: number

      // @BelongsTo(User, 'user_id')
      author!: User

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          author: this.belongsTo(User, 'user_id')
        }
      }
    }

    const post = new Post({
      id: 1,
      user_id: 3,
      author: { id: 3 }
    })

    expect(post.id).toBe(1)

    expect(post.author).toBeInstanceOf(User)
    expect(post.author.id).toBe(3)
  })

  it('can resolve has many relation', () => {
    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @HasMany(Comment, 'post_id')
      comments!: Comment[]

      static fields () {
        return {
          id: this.attr(null),
          comments: this.hasMany(Comment, 'post_id')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      // @Attribute
      id!: number

      // @Attribute
      post_id!: number

      static fields () {
        return {
          id: this.attr(null),
          post_id: this.attr(null)
        }
      }
    }

    const post = new Post({
      id: 1,
      comments: [
        { id: 1, post_id: 1 },
        { id: 2, post_id: 1 }
      ]
    })

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

      // @Attribute
      id!: number

      // @HasManyBy(Comment, 'comments')
      comments!: Comment[]

      static fields () {
        return {
          id: this.attr(null),
          comments: this.hasManyBy(Comment, 'comments')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      // @Attribute
      id!: number

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    const post = new Post({
      id: 1,
      comments: [
        { id: 1, post_id: 1 },
        { id: 2, post_id: 1 }
      ]
    })

    expect(post).toBeInstanceOf(Post)
    expect(post.comments[0]).toBeInstanceOf(Comment)
    expect(post.comments[1]).toBeInstanceOf(Comment)
    expect(post.comments[0].id).toBe(1)
    expect(post.comments[1].id).toBe(2)
  })

  it('can resolve empty has many relation', () => {
    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @HasMany(Comment, 'post_id')
      comments!: Comment[]

      static fields () {
        return {
          id: this.attr(null),
          comments: this.hasMany(Comment, 'post_id')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      // @Attribute
      id!: number

      // @Attribute
      post_id!: number

      static fields () {
        return {
          id: this.attr(null),
          post_id: this.attr(null)
        }
      }
    }

    const post = new Post({
      id: 1,
      comments: []
    })

    expect(post).toBeInstanceOf(Post)
    expect(post.id).toBe(1)
    expect(post.comments).not.toBeNull()
    expect(post.comments).toEqual([])
    expect(post.comments.length).toBe(0)
  })

  it('can resolve empty has many by relation', () => {
    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @HasManyBy(Comment, 'comments')
      comments!: Comment[]

      static fields () {
        return {
          id: this.attr(null),
          comments: this.hasManyBy(Comment, 'comments')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      // @Attribute
      id!: number

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    const post = new Post({
      id: 1,
      comments: []
    })

    expect(post).toBeInstanceOf(Post)
    expect(post.id).toBe(1)
    expect(post.comments).not.toBeNull()
    expect(post.comments).toEqual([])
    expect(post.comments.length).toBe(0)
  })
})
