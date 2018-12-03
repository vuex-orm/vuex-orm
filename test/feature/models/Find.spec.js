import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Models – Find', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  it('can fetch a record via static method', async () => {
    createStore([{ model: User }])

    await User.insert({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const user = User.find(1)

    const expected = { $id: 1, id: 1, name: 'John Doe' }

    expect(user).toEqual(expected)
    expect(user).toBeInstanceOf(User)
  })

  it('can fetch a record via instance method', async () => {
    createStore([{ model: User }])

    await User.insert({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const u = new User()

    const user = u.$find(1)

    const expected = { $id: 1, id: 1, name: 'John Doe' }

    expect(user).toEqual(expected)
    expect(user).toBeInstanceOf(User)
  })

  it('can fetch array of records via static method', async () => {
    createStore([{ model: User }])

    await User.insert({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'Smith Doe' }
      ]
    })

    const users = User.findIn([1, 3])

    const expected = [{ $id: 1, id: 1, name: 'John Doe' }, { $id: 3, id: 3, name: 'Smith Doe' }]

    expect(users).toEqual(expected)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[1]).toBeInstanceOf(User)
  })

  it('can fetch array of records via instance method', async () => {
    createStore([{ model: User }])

    await User.insert({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'Smith Doe' }
      ]
    })

    const u = new User()

    const users = u.$findIn([1, 3])

    const expected = [{ $id: 1, id: 1, name: 'John Doe' }, { $id: 3, id: 3, name: 'Smith Doe' }]

    expect(users).toEqual(expected)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[1]).toBeInstanceOf(User)
  })
})
