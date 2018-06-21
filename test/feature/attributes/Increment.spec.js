import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Attributes – Increment', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.increment()
      }
    }
  }

  it('converts a non-number value to the `null` when creating a record', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 'Not number' }
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1 },
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('converts a non-number value to the `null` when instantiating a model', async () => {
    const user = new User({ id: 'Not number' })

    expect(user.id).toBe(null)
  })
})
