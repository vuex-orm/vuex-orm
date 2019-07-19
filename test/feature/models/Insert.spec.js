import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Models – Insert', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  it('can insert a record via static method', async () => {
    const store = createStore([{ model: User }])

    await User.insert({
      data: { id: 1, name: 'John Doe' }
    })

    await User.insert({
      data: { id: 2, name: 'Jane Doe' }
    })

    const expected = createState({
      users: {
        1: { $id: 1, id: 1, name: 'John Doe' },
        2: { $id: 2, id: 2, name: 'Jane Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can insert list of record via static method', async () => {
    const store = createStore([{ model: User }])

    await User.insert({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const expected = createState({
      users: {
        1: { $id: 1, id: 1, name: 'John Doe' },
        2: { $id: 2, id: 2, name: 'Jane Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('returns inserted records via static method', async () => {
    createStore([{ model: User }])

    const data = await User.insert({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    expect(data.users.length).toBe(2)
    expect(data.users[0]).toBeInstanceOf(User)
  })

  it('can insert a record via instance method', async () => {
    const store = createStore([{ model: User }])

    const user = new User()

    await user.$insert({
      data: { id: 1, name: 'John Doe' }
    })

    await user.$insert({
      data: { id: 2, name: 'Jane Doe' }
    })

    const expected = createState({
      users: {
        1: { $id: 1, id: 1, name: 'John Doe' },
        2: { $id: 2, id: 2, name: 'Jane Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can insert list of record via instance method', async () => {
    const store = createStore([{ model: User }])

    const user = new User()

    await user.$insert({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const expected = createState({
      users: {
        1: { $id: 1, id: 1, name: 'John Doe' },
        2: { $id: 2, id: 2, name: 'Jane Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('returns inserted records via instance method', async () => {
    createStore([{ model: User }])

    const user = new User()

    const data = await user.$insert({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    expect(data.users.length).toBe(2)
    expect(data.users[0]).toBeInstanceOf(User)
  })
})
