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

    const expected = [{ $id: '1', id: 1 }, { $id: '2', id: 2 }]

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

    const expected = [{ $id: '1', id: 1 }, { $id: '2', id: 2 }]

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

    const expected = [{ $id: '1', id: 1 }, { $id: '2', id: 2 }]

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

  it('can retrieve array of items by their ids', async () => {
    const store = createStore([{ model: User }])

    User.insert({
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    })

    const expected = [{ $id: '1', id: 1 }, { $id: '3', id: 3 }]

    const users1 = store.getters['entities/users/findIn']([1, 3])

    expect(users1.length).toBe(2)
    expect(users1[0]).toBeInstanceOf(User)
    expect(users1[1]).toBeInstanceOf(User)
    expect(users1).toEqual(expected)

    const users2 = store.getters['entities/users/findIn']([4, 5])

    expect(users2).toEqual([])
  })

  it('can retrieve a single item by chaind find method', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    const expected = { $id: '2', id: 2 }

    const user = store.getters['entities/users/query']().find(2)

    expect(user).toEqual(expected)
  })

  describe('#first', () => {
    it('can retrieve the first item from the store', async () => {
      createStore([{ model: User }])

      await User.insert({
        data: [{ id: 1 }, { id: 2 }]
      })

      const expected = { $id: '1', id: 1 }

      const user = User.query().first()

      expect(user).toEqual(expected)
    })

    it('returns `null` if it can not find any record', () => {
      createStore([{ model: User }])

      const user = User.query().first()

      expect(user).toBe(null)
    })
  })

  describe('#last', () => {
    it('can retrieve the last item from the store', async () => {
      createStore([{ model: User }])

      User.insert({
        data: [{ id: 1 }, { id: 2 }]
      })

      const expected = { $id: '2', id: 2 }

      const user = User.query().last()

      expect(user).toEqual(expected)
    })

    it('returns `null` if it can not find any record', () => {
      createStore([{ model: User }])

      const user = User.query().last()

      expect(user).toBe(null)
    })
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
