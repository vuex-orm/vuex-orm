import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Relations – Belongs To', () => {
  it('can generate relation field', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class Phone extends Model {
      static entity = 'phones'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          user: this.belongsTo(User, 'user_id')
        }
      }
    }

    const store = createStore([{ model: User }, { model: Phone }])

    await store.dispatch('entities/phones/create', {
      data: {
        id: 1,
        user: { id: 1 }
      }
    })

    const phone = store.getters['entities/phones/query']().with('user').find(1)

    expect(phone.user).toBeInstanceOf(User)
  })
})
