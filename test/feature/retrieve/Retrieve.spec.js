import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Retrieve', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null)
      }
    }
  }

  it('retrieves null when passing `undefined` to the `find` method', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    const user = store.getters['entities/users/find']()

    expect(user).toBe(null)
  })
})
