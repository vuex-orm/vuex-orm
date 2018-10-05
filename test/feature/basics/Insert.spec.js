import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Basics – Insert', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('JD')
      }
    }
  }

  it('can create a data', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/insert', {
      data: { id: 1, name: 'John Doe' }
    })

    const expected = {
      '1': { $id: 1, id: 1, name: 'John Doe' }
    }

    expect(store.state.entities.users.data[1]).toBeInstanceOf(User)
    expect(store.state.entities.users.data).toEqual(expected)
  })
})
