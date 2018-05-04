import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Relations – Retrieve – With', () => {
  it('can resolve relation constraint', () => {
    class User extends Model {
      static entity = 'users'

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

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Phone }, { model: Post }])

    store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    })

    store.dispatch('entities/phones/create', {
      data: [{ id: 1, user_id: 1, }, { id: 2, user_id: 2, }, { id: 3, user_id: 3, }]
    })

    store.dispatch('entities/posts/create', {
      data: [{ id: 1, user_id: 1, }, { id: 2, user_id: 1, }, { id: 3, user_id: 2, }]
    })

    const expected = {
      $id: 1,
      id: 1,
      phone: { $id: 1, id: 1, user_id: 1 },
      posts: [
        { $id: 1, id: 1, user_id: 1 },
        { $id: 2, id: 2, user_id: 1 }
      ]
    }

    const users1 = store.getters['entities/users/query']().withAll().find(1)
    const users2 = store.getters['entities/users/query']().with('*').find(1)

    expect(users1).toEqual(expected)
    expect(users2).toEqual(expected)
  })

  it('can resolve all relations recursively', () => {
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
          comments: this.hasMany(Comment, 'post_id')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

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

      static fields () {
        return {
          id: this.attr(null),
          comment_id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }, { model: Comment }, { model: Like }])

    store.dispatch('entities/users/create', {
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
      $id: 1,
      id: 1,
      posts: [
        {
          $id: 1,
          id: 1,
          user_id: 1,
          comments: [
            { $id: 1, id: 1, post_id: 1, likes: [{ $id: 1, id: 1, comment_id: 1 }] },
            { $id: 2, id: 2, post_id: 1, likes: [{ $id: 2, id: 2, comment_id: 2 }] }
          ]
        },
        {
          $id: 2,
          id: 2,
          user_id: 1,
          comments: [
            { $id: 3, id: 3, post_id: 2, likes: [{ $id: 3, id: 3, comment_id: 3 }] },
            { $id: 4, id: 4, post_id: 2, likes: [{ $id: 4, id: 4, comment_id: 4 }] }
          ]
        }
      ]
    }

    const users = store.getters['entities/users/query']().withAllRecursive(2).find(1)

    expect(users).toEqual(expected)
  })

  it('can resolve child relation', () => {
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

    const store = createStore([{ model: User }, { model: Post }, { model: Comment }])

    store.dispatch('entities/users/create', {
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
      $id: 1,
      id: 1,
      posts: [
        {
          $id: 1,
          id: 1,
          user_id: 1,
          comments: [
            { $id: 1, id: 1, post_id: 1 },
            { $id: 2, id: 2, post_id: 1 }
          ]
        },
        {
          $id: 2,
          id: 2,
          user_id: 1,
          comments: [
            { $id: 3, id: 3, post_id: 2 },
            { $id: 4, id: 4, post_id: 2 }
          ]
        }
      ]
    }

    const users = store.getters['entities/users/query']().with('posts.comments').find(1)

    expect(users).toEqual(expected)
  })

  it('can resolve even deeper child relation', () => {
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
          comments: this.hasMany(Comment, 'post_id')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

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

      static fields () {
        return {
          id: this.attr(null),
          comment_id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }, { model: Comment }, { model: Like }])

    store.dispatch('entities/users/create', {
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
      $id: 1,
      id: 1,
      posts: [
        {
          $id: 1,
          id: 1,
          user_id: 1,
          comments: [
            { $id: 1, id: 1, post_id: 1, likes: [{ $id: 1, id: 1, comment_id: 1 }] },
            { $id: 2, id: 2, post_id: 1, likes: [{ $id: 2, id: 2, comment_id: 2 }] }
          ]
        },
        {
          $id: 2,
          id: 2,
          user_id: 1,
          comments: [
            { $id: 3, id: 3, post_id: 2, likes: [{ $id: 3, id: 3, comment_id: 3 }] },
            { $id: 4, id: 4, post_id: 2, likes: [{ $id: 4, id: 4, comment_id: 4 }] }
          ]
        }
      ]
    }

    const users = store.getters['entities/users/query']().with('posts.comments.likes').find(1)

    expect(users).toEqual(expected)
  })

  it('can resolve child relations with multiple sub relations', () => {
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

    store.dispatch('entities/users/create', {
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
      $id: 1,
      id: 1,
      posts: [
        {
          $id: 1,
          id: 1,
          user_id: 1,
          comments: [
            { $id: 1, id: 1, post_id: 1 },
            { $id: 2, id: 2, post_id: 1 }
          ],
          likes: [
            { $id: 1, id: 1, post_id: 1 },
            { $id: 2, id: 2, post_id: 1 }
          ]
        },
        {
          $id: 2,
          id: 2,
          user_id: 1,
          comments: [
            { $id: 3, id: 3, post_id: 2 },
            { $id: 4, id: 4, post_id: 2 }
          ],
          likes: [
            { $id: 3, id: 3, post_id: 2 },
            { $id: 4, id: 4, post_id: 2 }
          ]
        }
      ]
    }

    const user1 = store.getters['entities/users/query']().with('posts.comments|likes').find(1)
    const user2 = store.getters['entities/users/query']().with('posts.*').find(1)

    expect(user1).toEqual(expected)
    expect(user2).toEqual(expected)
  })
})
