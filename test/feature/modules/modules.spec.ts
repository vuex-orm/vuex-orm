import Vue from 'vue'
import Vuex, { Module } from 'vuex'
import VuexORM, { Database, Model } from '@/index'

describe('feature/modules/modules', () => {
  Vue.use(Vuex)

  it('can install a custom module along with the model', async () => {
    class User extends Model {
      static entity = 'users'
    }

    const users: Module<{ count: number }, any> = {
      state: () => ({
        count: 1
      }),
      getters: {
        double: (state) => state.count * 2
      },
      actions: {
        increment({ commit }) {
          commit('increment')
        }
      },
      mutations: {
        increment(state) {
          state.count++
        }
      }
    }

    const database = new Database()

    database.register(User, users)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    expect(store.state.entities.users.count).toBe(1)
    expect(store.getters['entities/users/double']).toBe(2)

    await store.dispatch('entities/users/increment')

    expect(store.state.entities.users.count).toBe(2)
    expect(store.getters['entities/users/double']).toBe(4)
  })
})
