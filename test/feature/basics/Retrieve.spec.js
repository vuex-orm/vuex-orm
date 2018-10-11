import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Retrieve', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null)
      }
    }
  }

  it('can retrieve all records as a model instance by all method', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    const expected = [{ $id: 1, id: 1 }, { $id: 2, id: 2 }]

    const users = store.getters['entities/users/all']()

    expect(users.length).toBe(2)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[1]).toBeInstanceOf(User)
    expect(users).toEqual(expected)
  })

  it('can retrieve all records by chaind all method', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    const expected = [{ $id: 1, id: 1 }, { $id: 2, id: 2 }]

    const users = store.getters['entities/users/query']().all()

    expect(users.length).toBe(2)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[1]).toBeInstanceOf(User)
    expect(users).toEqual(expected)
  })

  it('can retrieve all records as a model instance by get method', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    const expected = [{ $id: 1, id: 1 }, { $id: 2, id: 2 }]

    const users = store.getters['entities/users/query']().get()

    expect(users.length).toBe(2)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[1]).toBeInstanceOf(User)
    expect(users).toEqual(expected)
  })

  it('returns empty array when multiple record can not be found', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    const users = store.getters['entities/users/query']().where('id', 3).get()

    expect(users).toEqual([])
  })

  it('can retrieve a single item by id', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    const user = store.getters['entities/users/find'](2)

    expect(user.id).toBe(2)
  })

  it('can retrieve a single item by chaind find method', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    const expected = { $id: 2, id: 2 }

    const user = store.getters['entities/users/query']().find(2)

    expect(user).toEqual(expected)
  })

  it('can retrieve the first item in the state', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    const expected = { $id: 1, id: 1 }

    const user = store.getters['entities/users/query']().first()

    expect(user).toEqual(expected)
  })

  it('can retrieve the last item in the state', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    const expected = { $id: 2, id: 2 }

    const user = store.getters['entities/users/query']().last()

    expect(user).toEqual(expected)
  })

  it('returns null when single item can not be found', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    const user = store.getters['entities/users/find'](3)

    expect(user).toBe(null)
  })

  it('returns null when passing `undefined` to the `find` method', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    const user = store.getters['entities/users/find']()

    expect(user).toBe(null)
  })
})
