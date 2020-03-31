import { createStore, createState } from 'test/support/Helpers'
import { Model } from '@/index'

describe('Feature - Repositories - CRUD Insert', () => {
  it('can insert given record to the store', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.string('')
        }
      }
    }

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
