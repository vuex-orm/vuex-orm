import { createStore, createState } from 'test/support/Helpers'
import { Model } from 'app/index'

describe('Feature - Repositories - CRUD Delete', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null)
      }
    }

    id!: any
  }

  it('can delete a record by specifying the id', async () => {
    const store = createStore([User])

    const user = store.$repo(User)

    await user.insert({
      data: [{ id: 1 }, { id: 2 }]
    })

    await user.delete(1)

    const expected = createState({
      users: {
        2: { $id: '2', id: 2 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete records by specifying a closure', async () => {
    const store = createStore([User])

    const user = store.$repo(User)

    await user.insert({
      data: [{ id: 1 }, { id: 2 }]
    })

    await user.delete(user => user.id === 2)

    const expected = createState({
      users: {
        1: { $id: '1', id: 1 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete all records in the entity', async () => {
    const store = createStore([User])

    const user = store.$repo(User)

    await user.insert({
      data: [{ id: 1 }, { id: 2 }]
    })

    await user.deleteAll()

    const expected = createState({
      users: {}
    })

    expect(store.state.entities).toEqual(expected)
  })
})
