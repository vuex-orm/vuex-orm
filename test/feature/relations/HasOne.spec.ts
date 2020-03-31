import { createStore, createState } from 'test/support/Helpers'
import { Model, Fields } from '@/index'

describe('Features – Relations – Has One', () => {
  class User extends Model {
    static entity = 'users'

    static fields(): Fields {
      return {
        id: this.attr(null),
        phone: this.hasOne(Phone, 'user_id')
      }
    }
  }

  class Phone extends Model {
    static entity = 'phones'

    static fields(): Fields {
      return {
        id: this.attr(null),
        user_id: this.attr(null)
      }
    }
  }

  it('can create data containing the has one relation', async () => {
    const store = createStore([{ model: User }, { model: Phone }])

    await User.insert({
      data: {
        id: 1,
        phone: { id: 1, user_id: 1 }
      }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, phone: null }
      },
      phones: {
        1: { $id: '1', id: 1, user_id: 1 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can create data when the has one relation is empty', async () => {
    const store = createStore([{ model: User }, { model: Phone }])

    await User.insert({
      data: { $id: '1', id: 1 }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, phone: null }
      },
      phones: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can create data when the has one relation is `null`', async () => {
    const store = createStore([{ model: User }, { model: Phone }])

    await User.insert({
      data: {
        id: 1,
        phone: null
      }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, phone: null }
      },
      phones: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can create data when the has one relation is set to primitive value', async () => {
    const store = createStore([{ model: User }, { model: Phone }])

    await User.insert({
      data: { id: 1, phone: 1 }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, phone: null }
      },
      phones: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('it can create data containing mixed fields value', async () => {
    const store = createStore([{ model: User }, { model: Phone }])

    await User.insert({
      data: [
        {
          id: 1,
          phone: { id: 1, user_id: 1 }
        },
        {
          id: 2,
          phone: null
        }
      ]
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, phone: null },
        2: { $id: '2', id: 2, phone: null }
      },
      phones: {
        1: { $id: '1', id: 1, user_id: 1 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('assigns local key if it is not present when creating the record', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          local_key: this.attr(null),
          phone: this.hasOne(Phone, 'user_id', 'local_key')
        }
      }
    }

    const store = createStore([{ model: User }, { model: Phone }])

    await User.insert({
      data: {
        id: 1,
        phone: { id: 1 }
      }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, local_key: '1', phone: null }
      },
      phones: {
        1: { $id: '1', id: 1, user_id: '1' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can resolve the has one relation', async () => {
    createStore([{ model: User }, { model: Phone }])

    await User.insert({
      data: {
        id: 1,
        phone: { id: 1 }
      }
    })

    const expected = {
      $id: '1',
      id: 1,
      phone: {
        $id: '1',
        id: 1,
        user_id: 1
      }
    }

    const user = User.query()
      .with('phone')
      .find(1)

    expect(user).toEqual(expected)
    expect(user).toBeInstanceOf(User)
  })

  it('can resolve the empty has one relation', async () => {
    const store = createStore([{ model: User }, { model: Phone }])

    await User.insert({
      data: { id: 1 }
    })

    const expected = { $id: '1', id: 1, phone: null }

    const user = store.getters['entities/users/query']()
      .with('phone')
      .find(1)

    expect(user).toEqual(expected)
  })
})
