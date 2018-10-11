import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Attributes – Boolean', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        bool: this.boolean(true)
      }
    }
  }

  it('casts the value to `Boolean` when creating data', async () => {
    const store = createStore([{ model: User }])

    await User.create({
      data: [
        { id: 1 },
        { id: 2, bool: '' },
        { id: 3, bool: 'string' },
        { id: 4, bool: '0' },
        { id: 5, bool: 0 },
        { id: 6, bool: 1 },
        { id: 7, bool: true },
        { id: 8, bool: null }
      ]
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, bool: true },
        '2': { $id: 2, id: 2, bool: false },
        '3': { $id: 3, id: 3, bool: true },
        '4': { $id: 4, id: 4, bool: false },
        '5': { $id: 5, id: 5, bool: false },
        '6': { $id: 6, id: 6, bool: true },
        '7': { $id: 7, id: 7, bool: true },
        '8': { $id: 8, id: 8, bool: false }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('casts the value to `Boolean` when retrieving data', async () => {
    const store = createStore([{ model: User }])

    await User.create({
      data: [
        { id: 1 },
        { id: 2, bool: '' },
        { id: 3, bool: 'string' },
        { id: 4, bool: '0' },
        { id: 5, bool: 0 },
        { id: 6, bool: 1 },
        { id: 7, bool: true },
        { id: 8, bool: null }
      ]
    })

    const users = User.all()

    expect(users[0].bool).toEqual(true)
    expect(users[1].bool).toEqual(false)
    expect(users[2].bool).toEqual(true)
    expect(users[3].bool).toEqual(false)
    expect(users[4].bool).toEqual(false)
    expect(users[5].bool).toEqual(true)
    expect(users[6].bool).toEqual(true)
    expect(users[7].bool).toEqual(false)
  })
})
