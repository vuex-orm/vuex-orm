import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'
import Query from '@/query/Query'

describe('Feature – Relations – Retrieve – Has', () => {
  class User extends Model {
    static entity = 'users'

    static fields() {
      return {
        id: this.attr(null),
        posts: this.hasMany(Post, 'user_id')
      }
    }
  }

  class Post extends Model {
    static entity = 'posts'

    static fields() {
      return {
        id: this.attr(null),
        user_id: this.attr(null),
        user: this.belongsTo(User, 'user_id')
      }
    }
  }

  it('can query data depending on relationship existence', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    })

    await store.dispatch('entities/posts/create', {
      data: [
        { id: 1, user_id: 1 },
        { id: 2, user_id: 2 },
        { id: 3, user_id: 2 }
      ]
    })

    const expected = [
      { $id: '1', id: 1, posts: [] },
      { $id: '2', id: 2, posts: [] }
    ]

    const users = store.getters['entities/users/query']()
      .has('posts')
      .get()

    expect(users).toEqual(expected)
  })

  it('can query data depending on relationship absence', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    })

    await store.dispatch('entities/posts/create', {
      data: [
        { id: 1, user_id: 1 },
        { id: 2, user_id: 2 },
        { id: 3, user_id: 2 }
      ]
    })

    const expected = [{ $id: '3', id: 3, posts: [] }]

    const users = store.getters['entities/users/query']()
      .hasNot('posts')
      .get()

    expect(users).toEqual(expected)
  })

  it('can query data depending on relationship existence with constraint', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          phone: this.hasOne(Phone, 'user_id'),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    class Phone extends Model {
      static entity = 'phones'

      static fields() {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const store = createStore([
      { model: User },
      { model: Phone },
      { model: Post }
    ])

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    })

    await store.dispatch('entities/posts/create', {
      data: [
        { id: 1, user_id: 1 },
        { id: 2, user_id: 2 },
        { id: 3, user_id: 2 }
      ]
    })

    await store.dispatch('entities/phones/create', {
      data: [{ id: 1, user_id: 2 }]
    })

    const expected1 = [{ $id: '1', id: 1, phone: null, posts: [] }]
    const expected2 = [{ $id: '2', id: 2, phone: null, posts: [] }]

    const users1 = store.getters['entities/users/query']()
      .whereHas('posts', (query: Query) => query.where('id', 1))
      .get()

    const users2 = store.getters['entities/users/query']()
      .whereHas('phone', (query: Query) => query.where('id', 1))
      .get()

    expect(users1).toEqual(expected1)
    expect(users2).toEqual(expected2)
  })

  it('can query data depending on relationship absence with constraint', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    })

    await store.dispatch('entities/posts/create', {
      data: [
        { id: 1, user_id: 1 },
        { id: 2, user_id: 2 },
        { id: 3, user_id: 2 }
      ]
    })

    const expected = [
      { $id: '2', id: 2, posts: [] },
      { $id: '3', id: 3, posts: [] }
    ]

    const users = store.getters['entities/users/query']()
      .whereHasNot('posts', (query: Query) => query.where('id', 1))
      .get()

    expect(users).toEqual(expected)
  })

  it('can query data depending on relationship existence with number', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    })

    await store.dispatch('entities/posts/create', {
      data: [
        { id: 1, user_id: 1 },
        { id: 2, user_id: 2 },
        { id: 3, user_id: 2 }
      ]
    })

    const expected = [{ $id: '2', id: 2, posts: [] }]

    const users = store.getters['entities/users/query']()
      .has('posts', 2)
      .get()

    expect(users).toEqual(expected)
  })

  it('can query data depending on relationship absence with number', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    })

    await store.dispatch('entities/posts/create', {
      data: [
        { id: 1, user_id: 1 },
        { id: 2, user_id: 2 },
        { id: 3, user_id: 2 }
      ]
    })

    const expected = [
      { $id: '1', id: 1, posts: [] },
      { $id: '3', id: 3, posts: [] }
    ]

    const users = store.getters['entities/users/query']()
      .hasNot('posts', 2)
      .get()

    expect(users).toEqual(expected)
  })

  it('can query data depending on relationship existence with string conditions', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          phone: this.hasOne(Phone, 'user_id'),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    class Phone extends Model {
      static entity = 'phones'

      static fields() {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const store = createStore([
      { model: User },
      { model: Phone },
      { model: Post }
    ])

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    })

    await store.dispatch('entities/posts/create', {
      data: [
        { id: 1, user_id: 1 },
        { id: 2, user_id: 2 },
        { id: 3, user_id: 2 }
      ]
    })

    await store.dispatch('entities/phones/create', {
      data: [{ id: 1, user_id: 1 }]
    })

    expect(
      store.getters['entities/users/query']()
        .has('posts', 1)
        .get()
    ).toEqual([
      { $id: '1', id: 1, phone: null, posts: [] },
      { $id: '2', id: 2, phone: null, posts: [] }
    ])
    expect(
      store.getters['entities/users/query']()
        .has('posts', '=', 1)
        .get()
    ).toEqual([{ $id: '1', id: 1, phone: null, posts: [] }])
    expect(
      store.getters['entities/users/query']()
        .has('posts', '>', 1)
        .get()
    ).toEqual([{ $id: '2', id: 2, phone: null, posts: [] }])
    expect(
      store.getters['entities/users/query']()
        .has('posts', '>=', 1)
        .get()
    ).toEqual([
      { $id: '1', id: 1, phone: null, posts: [] },
      { $id: '2', id: 2, phone: null, posts: [] }
    ])
    expect(
      store.getters['entities/users/query']()
        .has('posts', '<', 2)
        .get()
    ).toEqual([{ $id: '1', id: 1, phone: null, posts: [] }])
    expect(
      store.getters['entities/users/query']()
        .has('posts', '<=', 2)
        .get()
    ).toEqual([
      { $id: '1', id: 1, phone: null, posts: [] },
      { $id: '2', id: 2, phone: null, posts: [] }
    ])
    expect(
      store.getters['entities/users/query']()
        .has('posts', 'unknown', 1)
        .get()
    ).toEqual([{ $id: '1', id: 1, phone: null, posts: [] }])

    expect(
      store.getters['entities/users/query']()
        .has('phone', '=', 1)
        .get()
    ).toEqual([{ $id: '1', id: 1, phone: null, posts: [] }])
  })

  it('can query data depending on relationship absence with string conditions', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    })

    await store.dispatch('entities/posts/create', {
      data: [
        { id: 1, user_id: 1 },
        { id: 2, user_id: 2 },
        { id: 3, user_id: 2 }
      ]
    })

    expect(
      store.getters['entities/users/query']()
        .hasNot('posts', '>', 1)
        .get()
    ).toEqual([
      { $id: '1', id: 1, posts: [] },
      { $id: '3', id: 3, posts: [] }
    ])
    expect(
      store.getters['entities/users/query']()
        .hasNot('posts', '>=', 1)
        .get()
    ).toEqual([{ $id: '3', id: 3, posts: [] }])
    expect(
      store.getters['entities/users/query']()
        .hasNot('posts', '<', 2)
        .get()
    ).toEqual([
      { $id: '2', id: 2, posts: [] },
      { $id: '3', id: 3, posts: [] }
    ])
    expect(
      store.getters['entities/users/query']()
        .hasNot('posts', '<=', 2)
        .get()
    ).toEqual([{ $id: '3', id: 3, posts: [] }])
  })
})
