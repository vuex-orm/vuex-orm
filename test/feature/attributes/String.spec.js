import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Attributes – String', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        str: this.string('default')
      }
    }
  }

  it('casts the value to `String` when creating data', async () => {
    const store = createStore([{ model: User }])

    await User.create({
      data: [
        { id: 1 },
        { id: 2, str: 'value' },
        { id: 3, str: 1 },
        { id: 4, str: true },
        { id: 5, str: null }
      ]
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, str: 'default' },
        '2': { $id: 2, id: 2, str: 'value' },
        '3': { $id: 3, id: 3, str: '1' },
        '4': { $id: 4, id: 4, str: 'true' },
        '5': { $id: 5, id: 5, str: 'null' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('casts the value to `String` when retrieving data', async () => {
    const store = createStore([{ model: User }])

    await User.create({
      data: [
        { id: 1 },
        { id: 2, str: 'value' },
        { id: 3, str: 1 },
        { id: 4, str: true },
        { id: 5, str: null }
      ]
    })

    const users = User.all()

    expect(users[0].str).toEqual('default')
    expect(users[1].str).toEqual('value')
    expect(users[2].str).toEqual('1')
    expect(users[3].str).toEqual('true')
    expect(users[4].str).toEqual('null')
  })
})
