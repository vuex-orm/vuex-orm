import { createStore, createState } from 'test/support/Helpers'
import { Model } from 'app/index'

describe('Feature - Repositories - CRUD Update', () => {
  it('can update record by including primary key in the data', async () => {
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

    const user = store.$repo(User)

    await user.insert({
      data: { id: 1, name: 'John Doe' }
    })

    await user.update({ id: 1, name: 'Jane Doe' })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'Jane Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
