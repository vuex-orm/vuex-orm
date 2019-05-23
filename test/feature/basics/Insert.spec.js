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

  it('can insert a record', () => {
    const store = createStore([{ model: User }])

    User.insert({
      data: { id: 1, name: 'John Doe' }
    })

    const expected = createState({
      users: {
        1: { $id: 1, id: 1, name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
    expect(store.state.entities.users.data[1]).toBeInstanceOf(User)
  })

  it('does nothing if an empty object is passed', () => {
    const store = createStore([{ model: User }])

    User.insert({
      data: {}
    })

    const expected = createState({
      users: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can insert record with primary key value of `null`', () => {
    const store = createStore([{ model: User }])

    User.insert({
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
