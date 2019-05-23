import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Basics – Insert', () => {
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

    await User.insert({
      data: { id: 1, name: 'John Doe' }
    })

    const expected = {
      '1': { $id: 1, id: 1, name: 'John Doe' }
    }

    expect(store.state.entities.users.data[1]).toBeInstanceOf(User)
    expect(store.state.entities.users.data).toEqual(expected)
  })

  it('Does nothing if an empty object is passed', async () => {
    const store = createStore([{ model: User }])

    await User.insert({
      data: {}
    })

    expect(store.state.entities.users.data).toEqual({})
  })

  it('can insert record with primary key value of `null`', async () => {
    const store = createStore([{ model: User }])

    await User.insert({
      data: { id: null, name: 'John Doe' }
    })

    const expected = createState({
      users: {
        _no_key_1: { $id: '_no_key_1', id: null, name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
