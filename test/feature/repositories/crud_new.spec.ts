import { createStore, createState } from 'test/support/Helpers'
import { Model } from 'app/index'

describe('Feature - Repositories - CRUD New', () => {
  it('can insert a new record to the store', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.uid(),
          name: this.string('John Doe')
        }
      }
    }

    const store = createStore([User])

    await store.$repo(User).new()

    const expected = createState({
      users: {
        '$uid1': { $id: '$uid1', id: '$uid1', name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
