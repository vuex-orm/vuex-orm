import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Relations – Has One', () => {
  it('can create data containing the has one relation', () => {
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

    store.dispatch('entities/users/create', {
      data: {
        id: 1,
        phone: { id: 1 }
      }
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, phone: 1 }
      },
      phones: {
        '1': { $id: 1, id: 1, user_id: 1 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can resolve the has one relation', () => {
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

    store.dispatch('entities/users/create', {
      data: {
        id: 1,
        phone: { id: 1 }
      }
    })

    const expected = {
      $id: 1,
      id: 1,
      phone: {
        $id: 1,
        id: 1,
        user_id: 1
      }
    }

    const user = store.getters['entities/users/query']().with('phone').find(1)

    expect(user).toEqual(expected)
  })
})
