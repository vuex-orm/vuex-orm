import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Models – Update', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  it('can update a record via static method by passing in the id', async () => {
    const store = createStore([{ model: User }])

    await User.insert({ id: 1, name: 'John Doe' })

    await User.update({ id: 1, name: 'Jane Doe' })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'Jane Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can update a record via static method by passing `where` value', async () => {
    const store = createStore([{ model: User }])

    await User.insert({ id: 1, name: 'John Doe' })

    await User.update(
      { name: 'Jane Doe' },
      { where: 1 }
    )

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'Jane Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can update records via static method by passing where closure', async () => {
    const store = createStore([{ model: User }])

    await User.insert([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Jane Doe' }
    ])

    await User.update(
      { name: 'John Doe' },
      { where: (record) => record.name === 'Jane Doe' }
    )

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'John Doe' },
        2: { $id: '2', id: 2, name: 'John Doe' },
        3: { $id: '3', id: 3, name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can update a record via static method by passing data closure', async () => {
    const store = createStore([{ model: User }])

    await User.insert([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Jane Doe' }
    ])

    await User.update(
      (record) => { record.name = 'Jane Doe' },
      { where: 1 }
    )

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'Jane Doe' },
        2: { $id: '2', id: 2, name: 'Jane Doe' },
        3: { $id: '3', id: 3, name: 'Jane Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can update a record via instance method', async () => {
    const store = createStore([{ model: User }])

    const user = new User()

    await User.insert({ id: 1, name: 'John Doe' })

    await user.$update({ id: 1, name: 'Jane Doe' })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'Jane Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can omit id when updating via instance method', async () => {
    const store = createStore([{ model: User }])

    await User.insert({ id: 1, name: 'John Doe' })

    const user = User.find(1)

    await user.$update({ name: 'Jane Doe' })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'Jane Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can update a record via instance method by passing array of records', async () => {
    const store = createStore([{ model: User }])

    await User.insert([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])

    const user = store.getters['entities/users/find'](1)

    await user.$update([
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

  it('can update a record by passing where value to the instance method', async () => {
    const store = createStore([{ model: User }])

    const user = new User()

    await User.insert({ id: 1, name: 'John Doe' })

    await user.$update(
      { name: 'Jane Doe' },
      { where: 1 }
    )

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'Jane Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can update a record by passing `data` and `where` as closures', async () => {
    const store = createStore([{ model: User }])

    await User.insert({ id: 1, name: 'John Doe' })

    await User.update(
      (record) => { record.name = 'Jane Doe' },
      { where: (record) => record.id === 1 }
    )

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'Jane Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
