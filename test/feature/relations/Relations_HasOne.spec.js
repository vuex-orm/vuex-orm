import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Relations – Has One', () => {
  it('can create data containing a has one relation', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          phone: this.hasOne(Phone, 'user_id')
        }
      }
    }

    class Phone extends Model {
      static entity = 'phones'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Phone }])

    await store.dispatch('entities/users/create', {
      data: {
        id: 1,
        phone: { id: 1 }
      }
    })

    const user = store.getters['entities/users/query']().with('phone').find(1)

    expect(user).toBeInstanceOf(User)
    expect(user.phone).toBeInstanceOf(Phone)
    expect(user.phone.id).toBe(1)
  })
})
