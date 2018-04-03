import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Mutations', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr(''),
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
      }
    }
  }

  function getStore () {
    return createStore([{ model: User }, { model: Post }])
  }

  it('can commit `create`', () => {
    const store = getStore()

    store.commit('entities/create', {
      entity: 'users',
      data: [{ id: 1 }, { id: 2}]
    })

    const expected = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, name: '', posts: [] },
        '2': { $id: 2, id: 2, name: '', posts: [] }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can commit `insert`', () => {
    const store = getStore()

    store.commit('entities/insert', {
      entity: 'users',
      data: [{ id: 1 }, { id: 2 }]
    })

    store.commit('entities/insert', {
      entity: 'users',
      data: { id: 3 }
    })

    const expected = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, name: '', posts: [] },
        '2': { $id: 2, id: 2, name: '', posts: [] },
        '3': { $id: 3, id: 3, name: '', posts: [] }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can commit `update`', () => {
    const store = getStore()

    store.commit('entities/insert', {
      entity: 'users',
      data: { id: 1, name: 'John Doe' }
    })

    store.commit('entities/update', {
      entity: 'users',
      data: { id: 1, name: 'Jane Doe' }
    })

    const expected = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, name: 'Jane Doe', posts: [] }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can commit `insertOrUpdate`', () => {
    const store = getStore()

    store.commit('entities/insert', {
      entity: 'users',
      data: { id: 1, name: 'John Doe' }
    })

    store.commit('entities/insertOrUpdate', {
      entity: 'users',
      data: [
        { id: 1, name: 'Jane Doe' },
        { id: 2, name: 'Johnny Doe' }
      ]
    })

    const expected = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, name: 'Jane Doe', posts: [] },
        '2': { $id: 2, id: 2, name: 'Johnny Doe', posts: [] }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can commit `delete`', () => {
    const store = getStore()

    store.commit('entities/insert', {
      entity: 'users',
      data: { id: 1, name: 'John Doe' }
    })

    store.commit('entities/delete', {
      entity: 'users',
      where: 1
    })

    const expected = createState('entities', {
      users: {},
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can commit `deleteAll`', () => {
    const store = getStore()

    store.commit('entities/insert', {
      entity: 'users',
      data: [{ id: 1 }, { id: 2 }]
    })

    store.commit('entities/deleteAll', {
      entity: 'users'
    })

    const expected = createState('entities', {
      users: {},
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can commit `deleteAll` without payload', () => {
    const store = getStore()

    store.commit('entities/insert', {
      entity: 'users',
      data: {
        id: 1,
        posts: [{ id: 1 }, { id: 2 }]
      }
    })

    store.commit('entities/deleteAll')

    const expected = createState('entities', {
      users: {},
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })
})
