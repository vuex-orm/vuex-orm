import { createStore, fillState, assertState } from 'test/Helpers'
import { Model, Attr, Str } from '@/index'

describe('feature/repository/deletes_destroy', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('deletes record by the id', async () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    await store.$repo(User).destroy(2)

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })
  })

  it('returns `null` when no record was deleted', async () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      }
    })

    const user = await store.$repo(User).destroy(2)

    expect(user).toBe(null)

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      }
    })
  })

  it('deletes multiple records by an array of ids', async () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    await store.$repo(User).destroyMany([2, 3])

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      }
    })
  })
})
