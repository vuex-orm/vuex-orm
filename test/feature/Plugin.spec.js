import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from 'app'
import Model from 'app/Model'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('')
    }
  }
}

const database = new VuexORM.Database()

database.register(User, {})

Vue.use(Vuex)

describe('Plugin', () => {
  it('add additional feature to the Model', async () => {
    const plugin = {
      install (components) {
        components.Model.staticMethod = function () {
          return 'Hello'
        }

        components.Model.prototype.instanceProperty = ', world!'

        components.Model.prototype.instanceMethod = function () {
          return `${this.$self().staticMethod()}${this.instanceProperty}`
        }
      }
    }

    VuexORM.use(plugin)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    await store.dispatch('entities/users/create', { data: { id: 1, name: 'John' } })

    const user = store.getters['entities/users/find'](1)

    expect(user.id).toBe(1)
    expect(user.instanceMethod()).toBe('Hello, world!')
  })

  it('add additional feature to the Repo', async () => {
    const plugin = {
      install (components) {
        components.Repo.staticMethod = function () {
          return 'Hello'
        }

        components.Repo.prototype.instanceMethod = function () {
          return `${this.self().staticMethod()}, world!`
        }
      }
    }

    VuexORM.use(plugin)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    await store.dispatch('entities/users/create', { data: { id: 1, name: 'John' } })

    const repo = store.getters['entities/users/query']()

    expect(repo.instanceMethod()).toBe('Hello, world!')
  })
})
