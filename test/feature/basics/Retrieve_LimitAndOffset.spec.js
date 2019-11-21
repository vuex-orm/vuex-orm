import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Retrieve – Limit And Offset', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null)
      }
    }
  }

  it('can limit number of records', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
    })

    const expected = [{ $id: '1', id: 1 }, { $id: '2', id: 2 }]

    const users = store.getters['entities/users/query']()
      .limit(2)
      .get()

    expect(users).toEqual(expected)
  })

  it('can limit number of records from an offset', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 }
      ]
    })

    const expected = [{ $id: '2', id: 2 }, { $id: '3', id: 3 }]

    const users = store.getters['entities/users/query']()
      .limit(2)
      .offset(1)
      .get()

    expect(users).toEqual(expected)
  })
})
