import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Hooks – Insert', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr(''),
        age: this.attr(null)
      }
    }
  }

  it('can dispatch the `beforeCreate` hook that modifies the data being inserted', async () => {
    const users = {
      actions: {
        beforeCreate (context, record) {
          record.age = 30
        }
      }
    }

    const store = createStore([{ model: User, module: users }])

    const data = { id: 1, name: 'John Doe', age: 20 }

    await store.dispatch('entities/users/insert', {
      data: { id: 1, name: 'John Doe', age: 20 }
    })

    const user = store.getters['entities/users/find'](1)

    const expected = new User({ $id: 1, id: 1, name: 'John Doe', age: 30 })

    expect(user).toEqual(expected)
  })

  it('it will insert the record as is if the `beforeCreate` hook returns nothing', async () => {
    const users = {
      actions: {
        beforeCreate (context, record) {
          // Return nothing.
        }
      }
    }

    const store = createStore([{ model: User, module: users }])

    const data = { id: 1, name: 'John Doe', age: 20 }

    await store.dispatch('entities/users/insert', {
      data: { id: 1, name: 'John Doe', age: 20 }
    })

    const user = store.getters['entities/users/find'](1)

    const expected = new User({ $id: 1, id: 1, name: 'John Doe', age: 20 })

    expect(user).toEqual(expected)
  })

  it('can cancel the insert by returing false from `beforeCreate` hook', async () => {
    const users = {
      actions: {
        beforeCreate (context, record) {
          if (record.age === 20) {
            return false
          }
        }
      }
    }

    const store = createStore([{ model: User, module: users }])

    const data = [
      { id: 1, name: 'John Doe', age: 20 },
      { id: 2, name: 'Jane Doe', age: 24 }
    ]

    await store.dispatch('entities/users/insert', { data })

    const result = store.getters['entities/users/all']()

    expect(result.length).toBe(1)
    expect(result[0].id).toBe(2)
  })

  it('can dispatch the `afterCreate` hook', async () => {
    const users = {
      actions: {
        afterCreate (context, model) {
          expect(model).toBeInstanceOf(User)
          expect(model.id).toBe(1)
        }
      }
    }

    const store = createStore([{ model: User, module: users }])

    const data = { id: 1, name: 'John Doe', age: 20 }

    await store.dispatch('entities/users/insert', {
      data: { id: 1, name: 'John Doe', age: 20 }
    })
  })
})
