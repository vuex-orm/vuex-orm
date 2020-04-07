import { createStore, fillState, assertState } from 'test/Helpers'
import { Model, Attr, Str } from '@/index'

describe('feature/query/deletes_delete', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('deletes a record specified by the where clause', async () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    await store
      .$repo(User)
      .where('name', 'Jane Doe')
      .delete()

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })
  })

  it('can delete multiple records specified by the where clause', async () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    await store
      .$repo(User)
      .where('name', 'Jane Doe')
      .orWhere('name', 'Johnny Doe')
      .delete()

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      }
    })
  })
})
