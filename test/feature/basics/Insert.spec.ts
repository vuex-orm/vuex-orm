import { createStore, createState } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Basics – Insert', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.string('John Doe')
      }
    }
  }

  const getStore = () => createStore([{ model: User }])

  it('can insert a record', async () => {
    const store = getStore()

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
    const store = getStore()

    await store.dispatch('entities/users/insert', {
      data: {}
    })

    const expected = createState({
      users: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can insert record with primary key value of `null`', async () => {
    const store = getStore()

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
