import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Models – Query', () => {
  class User extends Model {
    static entity = 'users'

    static fields() {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  it('can begin query chain via static method', async () => {
    createStore([{ model: User }])

    await User.insert({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const users = User.query().get()

    const expected = [
      { $id: '1', id: 1, name: 'John Doe' },
      { $id: '2', id: 2, name: 'Jane Doe' }
    ]

    expect(users).toEqual(expected)
    expect(users[0]).toBeInstanceOf(User)
  })

  it('can begin query chain via instance method', async () => {
    createStore([{ model: User }])

    await User.insert({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const u = new User()

    const user = u.$query().find(1)

    const expected = { $id: '1', id: 1, name: 'John Doe' }

    expect(user).toEqual(expected)
    expect(user).toBeInstanceOf(User)
  })
})
