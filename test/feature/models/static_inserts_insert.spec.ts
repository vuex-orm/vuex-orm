import {
  createStore,
  createState,
  serializeCollection
} from 'test/support/Helpers'
import { Model } from '@/index'

describe('feature/models/static_inserts_insert', () => {
  class User extends Model {
    static entity = 'users'

    static fields() {
      return {
        id: this.attr(null),
        name: this.string('')
      }
    }
  }

  it('can insert a record', async () => {
    const store = createStore([User])

    await User.insert({ id: 1, name: 'John Doe' })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can insert multiple records', async () => {
    const store = createStore([User])

    await User.insert([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'John Doe' },
        2: { $id: '2', id: 2, name: 'Jane Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('keeps existing records', async () => {
    const store = createStore([User])

    await User.insert({ id: 1, name: 'John Doe' })
    await User.insert({ id: 2, name: 'Jane Doe' })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'John Doe' },
        2: { $id: '2', id: 2, name: 'Jane Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('returns newly created data', async () => {
    createStore([User])

    const result = await User.insert([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])

    const expected = [
      { $id: '1', id: 1, name: 'John Doe' },
      { $id: '2', id: 2, name: 'Jane Doe' }
    ]

    expect(result.users.length).toBe(2)
    expect(result.users[0]).toBeInstanceOf(User)
    expect(result.users[1]).toBeInstanceOf(User)
    expect(serializeCollection(result.users)).toEqual(expected)
  })

  // Test for deprecated payload API syntax.
  it('accepts the "payload" object as an argument', async () => {
    const store = createStore([User])

    await User.insert({
      data: { id: 1, name: 'John Doe' }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
