import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Hooks – Local Update', () => {
  it('can dispatch the `beforeUpdate` hook that modifies the data being updated', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }

      static beforeUpdate (user) {
        user.age = 30
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/insert', {
      data: { id: 1, name: 'John Doe', age: 20 }
    })

    await store.dispatch('entities/users/update', { id: 1, name: 'Jane Doe' })

    const user = store.getters['entities/users/find'](1)

    const expected = new User({ $id: 1, id: 1, name: 'Jane Doe', age: 30 })

    expect(user).toEqual(expected)
  })

  it('it will update the record as is if the `beforeUpdate` hook returns nothing', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }

      static beforeUpdate (user) {
        // Do nothing.
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/insert', {
      data: { id: 1, name: 'John Doe', age: 20 }
    })

    await store.dispatch('entities/users/update', { id: 1, name: 'Jane Doe', age: 30 })

    const user = store.getters['entities/users/find'](1)

    const expected = new User({ $id: 1, id: 1, name: 'Jane Doe', age: 30 })

    expect(user).toEqual(expected)
  })

  it('can cancel the update by returing false from `beforeUpdate` hook', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }

      static beforeUpdate (user) {
        return false
      }
    }

    const store = createStore([{ model: User }])

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

    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }

      static afterUpdate (user) {
        hit = true

        expect(user).toBeInstanceOf(User)
        expect(user.id).toBe(1)
        expect(user.age).toBe(30)
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/insert', {
      data: { id: 1, name: 'John Doe', age: 20 }
    })

    await store.dispatch('entities/users/update', { id: 1, age: 30 })

    expect(hit).toBe(true)
  })
})
