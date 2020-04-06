import {
  createStore,
  createState,
  serializeCollection
} from 'test/support/Helpers'
import Uid from '@/support/Uid'
import { Model } from '@/index'

describe('feature/query/inserts_insert', () => {
  class User extends Model {
    static entity = 'users'

    static fields() {
      return {
        id: this.attr(null),
        name: this.string('Default Doe')
      }
    }
  }

  beforeEach(() => {
    Uid.reset()
  })

  it('does nothing if the given data is empty', async () => {
    const store = createStore([User])

    await store.$repo(User).insert({})

    const expected = createState({
      users: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can insert a record', async () => {
    const store = createStore([User])

    await store.$repo(User).insert({ id: 1, name: 'John Doe' })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can insert multiple records', async () => {
    const store = createStore([User])

    await store.$repo(User).insert([
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

    await store.$repo(User).insert({ id: 1, name: 'John Doe' })
    await store.$repo(User).insert({ id: 2, name: 'Jane Doe' })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'John Doe' },
        2: { $id: '2', id: 2, name: 'Jane Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('fills missing fields with the default value', async () => {
    const store = createStore([User])

    await store.$repo(User).insert({ id: 1 })

    const expected = {
      1: { $id: '1', id: 1, name: 'Default Doe' }
    }

    expect(store.state.entities.users.data).toEqual(expected)
  })

  it('can insert record with missing primary key value', async () => {
    const store = createStore([User])

    await store.$repo(User).insert({ name: 'John Doe' })

    const expected = createState({
      users: {
        $uid1: { $id: '$uid1', id: '$uid1', name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can insert record with primary key value of `null`', async () => {
    const store = createStore([User])

    await store.$repo(User).insert({ id: null, name: 'John Doe' })

    const expected = createState({
      users: {
        $uid1: { $id: '$uid1', id: '$uid1', name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('returns newly created data', async () => {
    const store = createStore([User])

    const result = await store.$repo(User).insert([
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

    await store.$repo(User).insert({
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
