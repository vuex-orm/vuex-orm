import { createStore, createState } from 'test/support/Helpers'
import { Model } from 'app/index'

describe('Feature - Repositories - CRUD Insert or Update', () => {
  it('can insert or update given record to the store', async () => {
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

    await store.$repo(User).insertOrUpdate({
      data: [
        { id: 1, name: 'Jane Doe' },
        { id: 2, name: 'Johnny Doe' }
      ]
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'Jane Doe' },
        2: { $id: '2', id: 2, name: 'Johnny Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
