import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Retrieve – Direct Entity Call', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('JD')
      }
    }
  }

  function getStore () {
    return createStore([{ model: User }])
  }

  it('can directly call entity to fetch the repo instance', () => {
    const store = getStore()

    store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    const users = store.getters['entities/users']().get()

    expect(users.length).toBe(1)
    expect(users[0]).toBeInstanceOf(User)
  })

  it('can get plain records when calling entity directly', () => {
    const store = getStore()

    store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    const users = store.getters['entities/users'](false).get()

    expect(users).toEqual([{ $id: 1, id: 1, name: 'John Doe' }])
  })
})
