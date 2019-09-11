import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Hooks – Local Delete', () => {
  it('can dispatch the `beforeDelete` hook', async () => {
    let hit = false

    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      static beforeDelete () {
        hit = true
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    await store.dispatch('entities/users/delete', 1)

    expect(hit).toBe(true)
  })

  it('can cancel the delete by returning false from the `beforeDelete` hook', async () => {
    let hit = false

    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      static beforeDelete (record) {
        hit = true

        return !(record.name === 'Jane Doe')
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    await store.dispatch('entities/users/delete', 2)

    const expected = createState({
      users: {
        1: { $id: 1, id: 1, name: 'John Doe' },
        2: { $id: 2, id: 2, name: 'Jane Doe' }
      }
    })

    expect(hit).toBe(true)
    expect(store.state.entities).toEqual(expected)
  })

  it('can dispatch the `afterDelete` hook', async () => {
    let hit = false

    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      static afterDelete () {
        hit = true
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    await store.dispatch('entities/users/delete', 2)

    expect(hit).toBe(true)
  })
})
