/* tslint:disable:variable-name */
import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Relations – Retrieve – With', () => {
  it('can resolve all relations', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @HasOne(Phone, 'user_id')
      phone!: Phone

      // @HasMany(Post, 'user_id')
      posts!: Post[]

      static fields () {
        return {
          id: this.attr(null),
          phone: this.hasOne(Phone, 'user_id'),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    class Phone extends Model {
      static entity = 'phones'

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

    class Post extends Model {
      static entity = 'posts'

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

    createStore([{ model: User }, { model: Phone }, { model: Post }])

    await User.create({
      data: {
        id: 1,
        phone: { id: 2, user_id: 1 },
        posts: [
          { id: 3, user_id: 1 },
          { id: 4, user_id: 1 }
        ]
      }
    })

    const user1 = User.query().with('*').first() as User

    expect(user1.phone.id).toBe(2)
    expect(user1.posts[0].id).toBe(3)
    expect(user1.posts[1].id).toBe(4)

    const user2 = User.query().withAll().first() as User

    expect(user2.phone.id).toBe(2)
    expect(user2.posts[0].id).toBe(3)
    expect(user2.posts[1].id).toBe(4)
  })

  it('can resolve all relations recursively', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @HasOne(Phone, 'user_id')
      phone!: Phone

      // @HasMany(Post, 'user_id')
      posts!: Post[]

      static fields () {
        return {
          id: this.attr(null),
          phone: this.hasOne(Phone, 'user_id'),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    class Phone extends Model {
      static entity = 'phones'

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

    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @Attribute
      user_id!: number

      // @BelongsTo(User, 'user_id')
      user!: User

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          user: this.belongsTo(User, 'user_id')
        }
      }
    }

    createStore([{ model: User }, { model: Phone }, { model: Post }])

    await User.create({
      data: {
        id: 1,
        phone: { id: 2, user_id: 1 },
        posts: [
          {
            id: 3,
            user_id: 1,
            user: { id: 1 }
          },
          {
            id: 4,
            user_id: 1,
            user: { id: 1 }
          }
        ]
      }
    })

    const user1 = User.query().withAllRecursive().first() as User

    expect(user1.phone.id).toBe(2)
    expect(user1.posts[0].id).toBe(3)
    expect(user1.posts[0].user.id).toBe(1)
    expect(user1.posts[1].id).toBe(4)
    expect(user1.posts[1].user.id).toBe(1)

    const user2 = User.query().withAllRecursive(0).first() as User

    expect(user2.phone.id).toBe(2)
    expect(user2.posts[0].id).toBe(3)
    expect(user2.posts[0].user).toBe(null)
    expect(user2.posts[1].id).toBe(4)
    expect(user2.posts[1].user).toBe(null)
  })

  it('can resolve child relation', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @HasMany(Post, 'user_id')
      posts!: Post[]

      static fields () {
        return {
          id: this.attr(null),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @Attribute
      user_id!: number

      // @HasMany(Comment, 'post_id')
      comments!: Comment[]

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
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

    const store = createStore([{ model: User }, { model: Post }, { model: Comment }])

    await store.dispatch('entities/users/create', {
      data: {
        id: 1,
        posts: [
          {
            id: 1,
            user_id: 1,
            comments: [
              { id: 1, post_id: 1 },
              { id: 2, post_id: 1 }
            ]
          },
          {
            id: 2,
            user_id: 1,
            comments: [
              { id: 3, post_id: 2 },
              { id: 4, post_id: 2 }
            ]
          }
        ]
      }
    })

    const expected = {
      $id: '1',
      id: 1,
      posts: [
        {
          $id: '1',
          id: 1,
          user_id: 1,
          comments: [
            { $id: '1', id: 1, post_id: 1 },
            { $id: '2', id: 2, post_id: 1 }
          ]
        },
        {
          $id: '2',
          id: 2,
          user_id: 1,
          comments: [
            { $id: '3', id: 3, post_id: 2 },
            { $id: '4', id: 4, post_id: 2 }
          ]
        }
      ]
    }

    const users = User.query().with('posts.comments').find(1)

    expect(users).toEqual(expected)
  })

  it('can resolve child relation for multiple records', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @HasMany(Post, 'user_id')
      posts!: Post[]

      static fields () {
        return {
          id: this.attr(null),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @Attribute
      user_id!: number

      // @HasMany(Comment, 'post_id')
      comments!: Comment[]

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
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

    const store = createStore([{ model: User }, { model: Post }, { model: Comment }])

    await store.dispatch('entities/users/create', {
      data: [
        {
          id: 1,
          posts: [
            {
              id: 1,
              user_id: 1,
              comments: [
                { id: 1, post_id: 1 },
                { id: 2, post_id: 1 }
              ]
            }
          ]
        },
        {
          id: 2
        }
      ]
    })

    const expected = [
      {
        $id: '1',
        id: 1,
        posts: [
          {
            $id: '1',
            id: 1,
            user_id: 1,
            comments: [
              { $id: '1', id: 1, post_id: 1 },
              { $id: '2', id: 2, post_id: 1 }
            ]
          }
        ]
      },
      {
        $id: '2',
        id: 2,
        posts: []
      }
    ]

    const users = await store.getters['entities/users/query']()
      .with('posts.comments')
      .findIn([1, 2]) as User[]

    expect(users).toEqual(expected)
  })

  it('can resolve even deeper child relation', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @HasMany(Post, 'user_id')
      posts!: Post[]

      static fields () {
        return {
          id: this.attr(null),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @Attribute
      user_id!: number

      // @HasMany(Comment, 'post_id')
      posts!: Comment[]

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
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

      // @HasMany(Like, 'comment_id')
      likes!: Comment[]

      static fields () {
        return {
          id: this.attr(null),
          post_id: this.attr(null),
          likes: this.hasMany(Like, 'comment_id')
        }
      }
    }

    class Like extends Model {
      static entity = 'likes'

      // @Attribute
      id!: number

      // @Attribute
      comment_id!: number

      static fields () {
        return {
          id: this.attr(null),
          comment_id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }, { model: Comment }, { model: Like }])

    await store.dispatch('entities/users/create', {
      data: {
        id: 1,
        posts: [
          {
            id: 1,
            user_id: 1,
            comments: [
              { id: 1, post_id: 1, likes: [{ id: 1, comment_id: 1 }] },
              { id: 2, post_id: 1, likes: [{ id: 2, comment_id: 2 }] }
            ]
          },
          {
            id: 2,
            user_id: 1,
            comments: [
              { id: 3, post_id: 2, likes: [{ id: 3, comment_id: 3 }] },
              { id: 4, post_id: 2, likes: [{ id: 4, comment_id: 4 }] }
            ]
          }
        ]
      }
    })

    const expected = {
      $id: '1',
      id: 1,
      posts: [
        {
          $id: '1',
          id: 1,
          user_id: 1,
          comments: [
            { $id: '1', id: 1, post_id: 1, likes: [{ $id: '1', id: 1, comment_id: 1 }] },
            { $id: '2', id: 2, post_id: 1, likes: [{ $id: '2', id: 2, comment_id: 2 }] }
          ]
        },
        {
          $id: '2',
          id: 2,
          user_id: 1,
          comments: [
            { $id: '3', id: 3, post_id: 2, likes: [{ $id: '3', id: 3, comment_id: 3 }] },
            { $id: '4', id: 4, post_id: 2, likes: [{ $id: '4', id: 4, comment_id: 4 }] }
          ]
        }
      ]
    }

    const users = store.getters['entities/users/query']().with('posts.comments.likes').find(1) as User[]

    expect(users).toEqual(expected)
  })

  it('can resolve child relations with multiple sub relations with pipe', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @HasMany(Post, 'user_id')
      posts!: Post[]

      static fields () {
        return {
          id: this.attr(null),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @Attribute
      user_id!: number

      // @HasMany(Comment, 'post_id')
      comments!: Comment[]

      // @HasMany(Like, 'post_id')
      likes!: Like[]

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          comments: this.hasMany(Comment, 'post_id'),
          likes: this.hasMany(Like, 'post_id')
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

    class Like extends Model {
      static entity = 'likes'

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

    const store = createStore([{ model: User }, { model: Post }, { model: Comment }, { model: Like }])

    await store.dispatch('entities/users/create', {
      data: {
        id: 1,
        posts: [
          {
            id: 1,
            user_id: 1,
            comments: [
              { id: 1, post_id: 1 },
              { id: 2, post_id: 1 }
            ],
            likes: [
              { id: 1, post_id: 1 },
              { id: 2, post_id: 1 }
            ]
          },
          {
            id: 2,
            user_id: 1,
            comments: [
              { id: 3, post_id: 2 },
              { id: 4, post_id: 2 }
            ],
            likes: [
              { id: 3, post_id: 2 },
              { id: 4, post_id: 2 }
            ]
          }
        ]
      }
    })

    const expected = {
      $id: '1',
      id: 1,
      posts: [
        {
          $id: '1',
          id: 1,
          user_id: 1,
          comments: [
            { $id: '1', id: 1, post_id: 1 },
            { $id: '2', id: 2, post_id: 1 }
          ],
          likes: [
            { $id: '1', id: 1, post_id: 1 },
            { $id: '2', id: 2, post_id: 1 }
          ]
        },
        {
          $id: '2',
          id: 2,
          user_id: 1,
          comments: [
            { $id: '3', id: 3, post_id: 2 },
            { $id: '4', id: 4, post_id: 2 }
          ],
          likes: [
            { $id: '3', id: 3, post_id: 2 },
            { $id: '4', id: 4, post_id: 2 }
          ]
        }
      ]
    }

    const user1 = User.query().with('posts.comments|likes').find(1) as User
    const user2 = User.query().with('posts.*').find(1) as User

    expect(user1).toEqual(expected)
    expect(user2).toEqual(expected)
  })

  it('can resolve child relations with multiple sub relations in array', async () => {
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
          comments: this.hasMany(Comment, 'post_id'),
          likes: this.hasMany(Like, 'post_id')
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

    class Like extends Model {
      static entity = 'likes'

      static fields () {
        return {
          id: this.attr(null),
          post_id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }, { model: Comment }, { model: Like }])

    await store.dispatch('entities/users/create', {
      data: {
        id: 1,
        posts: [
          {
            id: 1,
            user_id: 1,
            comments: [
              { id: 1, post_id: 1 },
              { id: 2, post_id: 1 }
            ],
            likes: [
              { id: 1, post_id: 1 },
              { id: 2, post_id: 1 }
            ]
          },
          {
            id: 2,
            user_id: 1,
            comments: [
              { id: 3, post_id: 2 },
              { id: 4, post_id: 2 }
            ],
            likes: [
              { id: 3, post_id: 2 },
              { id: 4, post_id: 2 }
            ]
          }
        ]
      }
    })

    const expected = {
      $id: '1',
      id: 1,
      posts: [
        {
          $id: '1',
          id: 1,
          user_id: 1,
          comments: [
            { $id: '1', id: 1, post_id: 1 },
            { $id: '2', id: 2, post_id: 1 }
          ],
          likes: [
            { $id: '1', id: 1, post_id: 1 },
            { $id: '2', id: 2, post_id: 1 }
          ]
        },
        {
          $id: '2',
          id: 2,
          user_id: 1,
          comments: [
            { $id: '3', id: 3, post_id: 2 },
            { $id: '4', id: 4, post_id: 2 }
          ],
          likes: [
            { $id: '3', id: 3, post_id: 2 },
            { $id: '4', id: 4, post_id: 2 }
          ]
        }
      ]
    }

    const user1 = store.getters['entities/users/query']().with(['posts.comments', 'posts.likes']).find(1)
    const user2 = store.getters['entities/users/query']().with(['posts.*']).find(1)

    expect(user1).toEqual(expected)
    expect(user2).toEqual(expected)
  })

  it('ignores any unknown relationship name', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @HasMany(Post, 'user_id')
      posts!: Post[]

      static fields () {
        return {
          id: this.attr(null),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

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

    createStore([{ model: User }, { model: Post }])

    await User.create({
      data: {
        id: 1,
        posts: [
          { id: 1, user_id: 1 }
        ]
      }
    })

    const user = User.query().with('unknown').first() as User

    expect(user.posts.length).toBe(0)
  })

  it('does not retrieve empty relation', async () => {
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

    createStore([{ model: User }, { model: Post }])

    await User.create({
      data: {
        id: 1
      }
    })
    await Post.create({
      data: {
        id: 1,
        user_id: null
      }
    })

    const post = Post.query()
      .with('*')
      .first() as Post

    expect(post.id).toEqual(1)
    expect(post.user_id).toEqual(null)
    expect(post.author).toEqual(null)
  })
})
