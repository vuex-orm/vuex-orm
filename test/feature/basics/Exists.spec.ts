import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Exists', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null)
      }
    }
  }

  it('can check if a database is empty by exists method', async () => {
    createStore([{ model: User }])

    expect(User.exists()).toBe(false)
  })

  it('can check if a database contains data by exists method', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    expect(User.exists()).toBe(true)
  })

  it('can check if a query chain would return data', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    expect(User.query().where('id', 3).exists()).toBe(false)
    expect(User.query().where('id', 1).exists()).toBe(true)
  })
})
