import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Models – All', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  it('can fetch all records via static method', async () => {
    createStore([{ model: User }])

    await User.insert([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])

    const users = User.all()

    const expected = [
      { $id: '1', id: 1, name: 'John Doe' },
      { $id: '2', id: 2, name: 'Jane Doe' }
    ]

    expect(users).toEqual(expected)
    expect(users[0]).toBeInstanceOf(User)
  })

  it('can fetch all records via instance method', async () => {
    createStore([{ model: User }])

    await User.insert([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])

    const user = new User()

    const users = user.$all()

    const expected = [
      { $id: '1', id: 1, name: 'John Doe' },
      { $id: '2', id: 2, name: 'Jane Doe' }
    ]

    expect(users).toEqual(expected)
    expect(users[0]).toBeInstanceOf(User)
  })
})
