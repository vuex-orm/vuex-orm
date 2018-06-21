import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Attributes – Number', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        num: this.number(0)
      }
    }
  }

  it('casts the value to `Number` when creating data', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1 },
        { id: 2, num: 1 },
        { id: 3, num: '2' },
        { id: 4, num: true },
        { id: 5, num: false },
        { id: 6, num: null }
      ]
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, num: 0 },
        '2': { $id: 2, id: 2, num: 1 },
        '3': { $id: 3, id: 3, num: 2 },
        '4': { $id: 4, id: 4, num: 1 },
        '5': { $id: 5, id: 5, num: 0 },
        '6': { $id: 6, id: 6, num: 0 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('casts the value to `Number` when retrieving data', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1 },
        { id: 2, num: 1 },
        { id: 3, num: '2' },
        { id: 4, num: true },
        { id: 5, num: false },
        { id: 6, num: null }
      ]
    })

    const users = store.getters['entities/users/all']()

    expect(users[0].num).toEqual(0)
    expect(users[1].num).toEqual(1)
    expect(users[2].num).toEqual(2)
    expect(users[3].num).toEqual(1)
    expect(users[4].num).toEqual(0)
    expect(users[5].num).toEqual(0)
  })
})
