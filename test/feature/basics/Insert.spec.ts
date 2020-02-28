import { createStore, createState } from 'test/support/Helpers'
import { Model, Fields } from 'app/index'

describe('Feature – Basics – Insert', () => {
  class User extends Model {
    static entity = 'users'

    static fields (): Fields {
      return {
        id: this.attr(null),
        name: this.string('John Doe')
      }
    }
  }

  it('can insert a record', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/insert', {
      data: { id: 1, name: 'John Doe' }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('does nothing if an empty object is passed', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/insert', {
      data: {}
    })

    const expected = createState({
      users: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can insert record with primary key value of `null`', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/insert', {
      data: { id: null, name: 'John Doe' }
    })

    const expected = createState({
      users: {
        '$uid1': { $id: '$uid1', id: '$uid1', name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
