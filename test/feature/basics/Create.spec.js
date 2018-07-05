import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Basics – Create', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('JD')
      }
    }
  }

  it('can create a data', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    const expected = {
      '1': { $id: 1, id: 1, name: 'John Doe' }
    }

    expect(store.state.entities.users.data).toEqual(expected)
  })

  it('can create list of data', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const expected = {
      '1': { $id: 1, id: 1, name: 'John Doe' },
      '2': { $id: 2, id: 2, name: 'Jane Doe' }
    }

    expect(store.state.entities.users.data).toEqual(expected)
  })

  it('replaces any existing records', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    await store.dispatch('entities/users/create', {
      data: { id: 2, name: 'Jane Doe' }
    })

    const expected = {
      '2': { $id: 2, id: 2, name: 'Jane Doe' }
    }

    expect(store.state.entities.users.data).toEqual(expected)
  })

  it('cleans all existing records when passing empty object', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    await store.dispatch('entities/users/create', {
      data: {}
    })

    const expected = {}

    expect(store.state.entities.users.data).toEqual(expected)
  })

  it('cleans all existing records when passing empty array', async () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    store.dispatch('entities/users/create', {
      data: []
    })

    const expected = {}

    expect(store.state.entities.users.data).toEqual(expected)
  })

  it('fills missing fields with the default value', async () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: { id: 1 }
    })

    const expected = {
      '1': { $id: 1, id: 1, name: 'JD' }
    }

    expect(store.state.entities.users.data).toEqual(expected)
  })

  it('returns a newly created data', async () => {
    const store = createStore([{ model: User }])

    const collection = await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    const expected = {
      users: [new User({ $id: 1, id: 1, name: 'John Doe' })]
    }

    expect(collection).toEqual(expected)
  })

  it('returns list of newly created data', async () => {
    const store = createStore([{ model: User }])

    const collection = await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const expected = {
      users: [
        new User({ $id: 1, id: 1, name: 'John Doe' }),
        new User({ $id: 2, id: 2, name: 'Jane Doe' })
      ]
    }

    expect(collection).toEqual(expected)
  })

  it('returns null when creating empty data', async () => {
    const store = createStore([{ model: User }])

    const collection = await store.dispatch('entities/users/create', { data: {} })

    expect(collection).toEqual({})
  })
})
