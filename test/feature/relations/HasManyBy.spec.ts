/* tslint:disable:variable-name */
import { createStore, createState } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Features – Relations – Has Many By', () => {
  it('can create data containing the has many by relation', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          post_ids: this.attr([]),
          posts: this.hasManyBy(Post, 'post_ids')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }])

    await User.insert({
      data: {
        id: 1,
        posts: [{ id: 1 }, { id: 2 }]
      }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, post_ids: [1, 2], posts: [] }
      },
      posts: {
        1: { $id: '1', id: 1 },
        2: { $id: '2', id: 2 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can create data containing empty has many by relation', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          post_ids: this.attr([]),
          posts: this.hasManyBy(Post, 'posts')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }])

    await User.insert({
      data: { id: 1, posts: [] }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, post_ids: [], posts: [] }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can create data containing has many by key with `null`', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          post_ids: this.attr([]),
          posts: this.hasManyBy(Post, 'posts')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }])

    await User.insert({
      data: { id: 1, posts: null }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, post_ids: [], posts: [] }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can resolve the has many by relation', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          post_ids: this.attr([]),
          posts: this.hasManyBy(Post, 'post_ids')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    createStore([{ model: User }, { model: Post }])

    await User.insert({
      data: {
        id: 1,
        posts: [{ id: 1 }, { id: 2 }]
      }
    })

    const user = User.query()
      .with('posts')
      .find(1)

    const expected = {
      $id: '1',
      id: 1,
      post_ids: [1, 2],
      posts: [
        { $id: '1', id: 1 },
        { $id: '2', id: 2 }
      ]
    }

    expect(user).toEqual(expected)
  })

  it('can resolve the has many by relation with mixed existence', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          post_ids: this.attr([]),
          posts: this.hasManyBy(Post, 'post_ids')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    createStore([{ model: User }, { model: Post }])

    await User.insert({
      data: [
        { id: 1, posts: [{ id: 1 }, { id: 2 }] },
        { id: 2, post_ids: [], posts: [] }
      ]
    })

    const users = User.query()
      .with('posts')
      .get()

    const expected = [
      {
        $id: '1',
        id: 1,
        post_ids: [1, 2],
        posts: [
          { $id: '1', id: 1 },
          { $id: '2', id: 2 }
        ]
      },
      {
        $id: '2',
        id: 2,
        post_ids: [],
        posts: []
      }
    ]

    expect(users).toEqual(expected)
  })

  it('can apply `orderBy` constraint on nested relations', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @Attribute([])
      post_ids!: number[]

      // @HasManyBy(Post, 'post_ids')
      posts!: Post[]

      static fields() {
        return {
          id: this.attr(null),
          post_ids: this.attr([]),
          posts: this.hasManyBy(Post, 'post_ids')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    createStore([{ model: User }, { model: Post }])

    await User.insert({
      data: { id: 1, posts: [{ id: 1 }, { id: 3 }, { id: 2 }] }
    })

    const ascending = User.query()
      .with('posts', (query) => {
        query.orderBy('id', 'asc')
      })
      .find(1) as User

    expect(ascending.posts[0].id).toBe(1)
    expect(ascending.posts[1].id).toBe(2)
    expect(ascending.posts[2].id).toBe(3)

    const descending = User.query()
      .with('posts', (query) => {
        query.orderBy('id', 'desc')
      })
      .find(1) as User

    expect(descending.posts[0].id).toBe(3)
    expect(descending.posts[1].id).toBe(2)
    expect(descending.posts[2].id).toBe(1)
  })
})
