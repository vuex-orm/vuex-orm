import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Relations – Belongs To', () => {
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
        user: this.belongsTo(User, 'user_id')
      }
    }
  }

  it('can create data containing the belongs to relation', () => {
    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        user_id: 1,
        user: { id: 1 }
      }
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1 }
      },
      posts: {
        '1': { $id: 1, id: 1, user_id: 1, user: null }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can create data when the belongs to relation is `null`', () => {
    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        user_id: 1,
        user: null
      }
    })

    const expected = createState({
      users: {},
      posts: {
        '1': { $id: 1, id: 1, user_id: 1, user: null }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can generate relation field', () => {
    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        user: { id: 1 }
      }
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1 }
      },
      posts: {
        '1': { $id: 1, id: 1, user_id: 1, user: null }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('returns created record from `create` method', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    const result = await store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        user_id: 1,
        user: { id: 1 }
      }
    })

    const expected = {
      users: [{ $id: 1, id: 1 }],
      posts: [{ $id: 1, id: 1, user_id: 1, user: null }]
    }

    expect(result).toEqual(expected)
  })

  it('can resolve the belongs to relation', () => {
    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        user: { id: 1 }
      }
    })

    const expected = {
      $id: 1,
      id: 1,
      user_id: 1,
      user: {
        $id:1,
        id: 1
      }
    }

    const post = store.getters['entities/posts/query']().with('user').find(1)

    expect(post).toEqual(expected)
  })

  it('can resolve belongs to relation which its id is 0', () => {
    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        user: { id: 0 }
      }
    })

    const expected = {
      $id: 1,
      id: 1,
      user_id: 0,
      user: {
        $id: 0,
        id: 0
      }
    }

    const post = store.getters['entities/posts/query']().with('user').first()

    expect(post).toEqual(expected)
  })

  it('can resolve belongs to relation with custom foreign key', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          post_id: this.attr(null)
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          user: this.belongsTo(User, 'user_id', 'post_id')
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        user_id: 2,
        user: { id: 1, post_id: 2 }
      }
    })

    const expected = {
      $id: 1,
      id: 1,
      user_id: 2,
      user: {
        $id: 1,
        id: 1,
        post_id: 2
      }
    }

    const post = store.getters['entities/posts/query']().with('user').find(1)

    expect(post).toEqual(expected)
  })
})
