import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Retrieve – SSR Support', () => {
  class User extends Model {
    static entity = 'users'

    static fields() {
      return {
        id: this.attr(null)
      }
    }

    isActive() {
      return true
    }
  }

  const users = {
    mutations: {
      setUsers(state: any, users: any) {
        state.data = users
      }
    }
  }

  it('will instantiate pre hydrated records when fetching', () => {
    const store = createStore([{ model: User, module: users }])

    store.commit('entities/users/setUsers', [{ id: 1 }, { id: 2 }])

    const records = User.all()

    expect(records[0]).toBeInstanceOf(User)
    expect(records[1]).toBeInstanceOf(User)
  })

  it('can access record as Model instance inside retrieve callback with pre hydrated records', () => {
    const store = createStore([{ model: User, module: users }])

    store.commit('entities/users/setUsers', [{ id: 1 }, { id: 2 }])

    const records = User.query()
      .where((user: User) => user.isActive())
      .get()

    expect(records[0]).toBeInstanceOf(User)
    expect(records[1]).toBeInstanceOf(User)
  })
})
