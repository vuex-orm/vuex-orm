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
        1: { $id: 1, id: 1 }
      },
      posts: {
        1: { $id: 1, id: 1, user_id: 1, user: null }
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
        1: { $id: 1, id: 1, user_id: 1, user: null }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can create data when the belongs to relation is set to related model key', () => {
    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        user: 1
      }
    })

    const expected = createState({
      users: {},
      posts: {
        1: { $id: 1, id: 1, user_id: 1, user: null }
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
        1: { $id: 1, id: 1 }
      },
      posts: {
        1: { $id: 1, id: 1, user_id: 1, user: null }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can generate relation field with composite key', () => {
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

      static primaryKey = ['id', 'user_id']

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          user: this.belongsTo(User, 'user_id')
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/posts/create', {
      data: [
        { id: 1, user: { id: 10 } },
        { id: 1, user: { id: 20 } }
      ]
    })

    expect(store.state.entities.users.data[10].id).toBe(10)
    expect(store.state.entities.users.data[20].id).toBe(20)
    expect(store.state.entities.posts.data['[1,10]'].$id).toStrictEqual([1, 10])
    expect(store.state.entities.posts.data['[1,10]'].id).toBe(1)
    expect(store.state.entities.posts.data['[1,10]'].user_id).toBe(10)
    expect(store.state.entities.posts.data['[1,20]'].$id).toStrictEqual([1, 20])
    expect(store.state.entities.posts.data['[1,20]'].id).toBe(1)
    expect(store.state.entities.posts.data['[1,20]'].user_id).toBe(20)
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
        $id: 1,
        id: 1
      }
    }

    const post = store.getters['entities/posts/query']().with('user').find(1)

    expect(post).toEqual(expected)
  })

  it('resolves to null if there is no belongs to relation', () => {
    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        user_id: 1
      }
    })

    const expected = {
      $id: 1,
      id: 1,
      user_id: 1,
      user: null
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

  it('can resolve belongs to relation with composite foreign key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = ['workspace_id', 'id']

      static fields () {
        return {
          id: this.attr(null),
          workspace_id: this.attr(null)
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static primaryKey = ['workspace_id', 'id']

      static fields () {
        return {
          id: this.attr(null),
          workspace_id: this.attr(null),
          user_id: this.attr(null),
          user: this.belongsTo(User, ['workspace_id', 'user_id'])
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        workspace_id: 1,
        user_id: 1,
        user: { id: 1, workspace_id: 1 }
      }
    })

    const expected = {
      $id: '1_1',
      id: 1,
      workspace_id: 1,
      user_id: 1,
      user: {
        $id: '1_1',
        id: 1,
        workspace_id: 1
      }
    }

    const post = store.getters['entities/posts/query']().with('user').find('1_1')

    expect(post).toEqual(expected)
  })

  it('can create data when the belongs to relation is set to related model composite key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = ['workspace_id', 'id']

      static fields () {
        return {
          id: this.attr(null),
          workspace_id: this.attr(null)
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static primaryKey = ['workspace_id', 'id']

      static fields () {
        return {
          id: this.attr(null),
          workspace_id: this.attr(null),
          user_id: this.attr(null),
          user: this.belongsTo(User, ['workspace_id', 'user_id'])
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        user: '1_1'
      }
    })

    const expected = createState({
      users: {},
      posts: {
        '1_1': { $id: '1_1', id: 1, workspace_id: 1, user_id: 1, user: null }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
