import { createStore, createState } from 'test/support/Helpers'
import { Model } from 'app/index'

describe('Feature - Repositories - CRUD Create', () => {
  it('can create given record to the store', async () => {
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

    await store.$repo(User).create({
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
