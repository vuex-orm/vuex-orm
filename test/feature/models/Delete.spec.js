import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Models – Delete', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  it('can delete a record via static method', async () => {
    const store = createStore([{ model: User }])

    await User.insert({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    await User.delete(2)

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete a record via static method by passing where value', async () => {
    const store = createStore([{ model: User }])

    await User.insert({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    await User.delete({ where: 2 })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete records via static method by passing closure', async () => {
    const store = createStore([{ model: User }])

    await User.insert({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'Jane Doe' }
      ]
    })

    await User.delete(record => record.name === 'Jane Doe')

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete a record via instance method', async () => {
    const store = createStore([{ model: User }])

    const user = new User()

    await User.insert({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    await user.$delete(2)

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can omit condition when deleting a record via instance method', async () => {
    const store = createStore([{ model: User }])

    await User.insert({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const user = store.getters['entities/users/find'](2)

    await user.$delete()

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
