import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Hooks – Local Insert', () => {
  it('can dispatch the `beforeCreate` hook that modifies the data being inserted', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }

      static beforeCreate (record) {
        record.age = 30
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/insert', {
      data: { id: 1, name: 'John Doe', age: 20 }
    })

    const user = store.getters['entities/users/find'](1)

    const expected = new User({ $id: 1, id: 1, name: 'John Doe', age: 30 })

    expect(user).toEqual(expected)
  })

  it('it will insert the record as is if the `beforeCreate` hook returns nothing', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }

      static beforeCreate (record) {
        // Do nothing.
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/insert', {
      data: { id: 1, name: 'John Doe', age: 20 }
    })

    const user = store.getters['entities/users/find'](1)

    const expected = new User({ $id: 1, id: 1, name: 'John Doe', age: 20 })

    expect(user).toEqual(expected)
  })

  it('can cancel the insert by returing false from `beforeCreate` hook', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }

      static beforeCreate (record) {
        if (record.age === 20) {
          return false
        }
      }
    }

    const store = createStore([{ model: User }])

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
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }

      static afterCreate (model) {
        expect(model).toBeInstanceOf(User)
        expect(model.id).toBe(1)
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/insert', {
      data: { id: 1, name: 'John Doe', age: 20 }
    })
  })
})
