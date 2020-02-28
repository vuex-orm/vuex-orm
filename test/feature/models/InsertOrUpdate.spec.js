import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Models – Insert Or Update', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  it('can insert or update records via static method', async () => {
    const store = createStore([{ model: User }])

    await User.insert([
      { id: 1, name: 'John Doe' }
    ])

    await User.insertOrUpdate([
      { id: 1, name: 'Jane Doe' },
      { id: 2, name: 'Johnny Doe' }
    ])

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'Jane Doe' },
        2: { $id: '2', id: 2, name: 'Johnny Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can insert or update records via instance method', async () => {
    const store = createStore([{ model: User }])

    const user = new User()

    await User.insert([
      { id: 1, name: 'John Doe' }
    ])

    await user.$insertOrUpdate([
      { id: 1, name: 'Jane Doe' },
      { id: 2, name: 'Johnny Doe' }
    ])

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'Jane Doe' },
        2: { $id: '2', id: 2, name: 'Johnny Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
