import { createStore, assertState } from 'test/Helpers'
import { Model, Attr } from '@/index'

describe('feature/query/inserts_insert', () => {
  class User extends Model {
    static entity = 'users'
    @Attr() id: any
  }

  it('inserts a record to the store', async () => {
    const store = createStore([User])

    await store.$repo(User).insert({ id: 1 })

    assertState(store, {
      users: {
        1: { id: 1 }
      }
    })
  })

  it('inserts records to the store', async () => {
    const store = createStore([User])

    await store.$repo(User).insert([{ id: 1 }, { id: 2 }])

    assertState(store, {
      users: {
        1: { id: 1 },
        2: { id: 2 }
      }
    })
  })

  it('does nothing if the given data is empty', async () => {
    const store = createStore([User])

    await store.$repo(User).insert({})
    assertState(store, { users: {} })

    await store.$repo(User).insert([])
    assertState(store, { users: {} })
  })
})
