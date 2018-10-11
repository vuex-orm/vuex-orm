import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Hooks – Update', () => {
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

  it('can dispatch the `beforeUpdate` hook that modifies the data being updated', async () => {
    const users = {
      actions: {
        beforeUpdate (context, record) {
          record.age = 30
        }
      }
    }

    const store = createStore([{ model: User, module: users }])

    await store.dispatch('entities/users/insert', {
      data: { id: 1, name: 'John Doe', age: 20 }
    })

    await store.dispatch('entities/users/update', { id: 1, name: 'Jane Doe' })

    const user = store.getters['entities/users/find'](1)

    const expected = new User({ $id: 1, id: 1, name: 'Jane Doe', age: 30 })

    expect(user).toEqual(expected)
  })

  it('it will update the record as is if the `beforeUpdate` hook returns nothing', async () => {
    const users = {
      actions: {
        beforeUpdate (context, record) {
          // Return nothing.
        }
      }
    }

    const store = createStore([{ model: User, module: users }])

    await store.dispatch('entities/users/insert', {
      data: { id: 1, name: 'John Doe', age: 20 }
    })

    await store.dispatch('entities/users/update', { id: 1, name: 'Jane Doe', age: 30 })

    const user = store.getters['entities/users/find'](1)

    const expected = new User({ $id: 1, id: 1, name: 'Jane Doe', age: 30 })

    expect(user).toEqual(expected)
  })

  it('can cancel the update by returing false from `beforeUpdate` hook', async () => {
    const users = {
      actions: {
        beforeUpdate (context, record) {
          return false
        }
      }
    }

    const store = createStore([{ model: User, module: users }])

    const data = [
      { id: 1, name: 'John Doe', age: 20 },
      { id: 2, name: 'Jane Doe', age: 24 }
    ]

    await store.dispatch('entities/users/insert', { data })

    await store.dispatch('entities/users/update', { id: 1, name: 'Johnny Doe' })

    const result = store.getters['entities/users/all']()

    expect(result.length).toBe(2)
    expect(result[0].id).toBe(1)
    expect(result[0].name).toBe('John Doe')
  })

  it('can dispatch the `afterUpdate` hook', async () => {
    let hit = null

    const users = {
      actions: {
        afterUpdate (context, model) {
          hit = true

          expect(model).toBeInstanceOf(User)
          expect(model.id).toBe(1)
          expect(model.age).toBe(30)
        }
      }
    }

    const store = createStore([{ model: User, module: users }])

    await store.dispatch('entities/users/insert', {
      data: { id: 1, name: 'John Doe', age: 20 }
    })

    await store.dispatch('entities/users/update', { id: 1, age: 30 })

    expect(hit).toBe(true)
  })
})
