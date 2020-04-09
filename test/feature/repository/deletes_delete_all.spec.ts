import { createStore, fillState, assertState } from 'test/Helpers'
import { Model, Attr, Str } from '@/index'

describe('feature/repository/deletes_delete_all', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('deletes all records in the store', async () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    await store.$repo(User).deleteAll()

    assertState(store, {
      users: {}
    })
  })
})
