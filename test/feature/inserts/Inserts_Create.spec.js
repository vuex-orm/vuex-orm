import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Inserts – Create', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('JD')
      }
    }
  }

  function getStore () {
    return createStore([{ model: User }])
  }

  it('can create a data', () => {
    const store = getStore()

    store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    const users = store.getters['entities/users/all']()

    expect(users.length).toBe(1)
    expect(users[0]).toBeInstanceOf(User)
  })

  it('can create list of data', () => {
    const store = getStore()

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const users = store.getters['entities/users/all']()

    expect(users.length).toBe(2)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[1]).toBeInstanceOf(User)
  })

  it('replaces any existing records', () => {
    const store = getStore()

    store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    store.dispatch('entities/users/create', {
      data: { id: 2, name: 'Jane Doe' }
    })

    const users = store.getters['entities/users/all']()

    expect(users.length).toBe(1)
    expect(users[0]).toBeInstanceOf(User)
  })

  it('cleans all existing records when passing empty object', () => {
    const store = getStore()

    store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    store.dispatch('entities/users/create', {
      data: {}
    })

    const users = store.getters['entities/users/all']()

    expect(users.length).toBe(0)
  })

  it('cleans all existing records when passing empty array', () => {
    const store = getStore()

    store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    store.dispatch('entities/users/create', {
      data: []
    })

    const users = store.getters['entities/users/all']()

    expect(users.length).toBe(0)
  })

  it('fills missing fields with the default value', () => {
    const store = getStore()

    store.dispatch('entities/users/create', {
      data: { id: 1 }
    })

    const users = store.getters['entities/users/all']()

    expect(users.length).toBe(1)
    expect(users[0].name).toBe('JD')
  })

  it('returns a newly created data', async () => {
    const store = getStore()

    const user = await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(1)
  })

  it('returns list of newly created data', async () => {
    const store = getStore()

    const users = await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    expect(users.length).toBe(2)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].id).toBe(1)
  })

  it('returns null when creating empty data', async () => {
    const store = getStore()

    const user = await store.dispatch('entities/users/create', { data: {} })

    expect(user).toBe(null)
  })
})
