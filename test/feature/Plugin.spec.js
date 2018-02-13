import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from 'app'
import Model from 'app/Model'
import Repo from 'app/repo/Repo'
import Query from 'app/repo/Query'

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

  it('add additional feature to the Query', async () => {
    const plugin = {
      install (components) {
        components.Repo.prototype.newQuery = function () {
          return new Query(this.state, this.name, this.primaryKey)
        }

        components.Query.prototype.instanceMethod = function () {
          return 'Hello, world!'
        }
      }
    }

    VuexORM.use(plugin)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    await store.dispatch('entities/users/create', { data: { id: 1, name: 'John' } })

    const repo = store.getters['entities/users/query']()

    expect(repo.newQuery().instanceMethod()).toBe('Hello, world!')
  })

  it('add additional feature to the rootGetters', () => {
    const plugin = {
      install (components) {
        components.rootGetters.getName = (state) => {
          return state.name
        }
      }
    }

    VuexORM.use(plugin)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    expect(store.getters['entities/getName']).toBe('entities')
  })

  it('add additional feature to the subGetters', () => {
    const plugin = {
      install (components) {
        components.subGetters.getName = (state) => {
          return state.$name
        }
      }
    }

    VuexORM.use(plugin)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    expect(store.getters['entities/users/getName']).toBe('users')
  })

  it('add additional feature to the rootActions', async () => {
    const plugin = {
      install (components) {
        components.rootActions.getName = () => {
          return 'John Doe'
        }
      }
    }

    VuexORM.use(plugin)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    expect(await store.dispatch('entities/getName')).toBe('John Doe')
  })

  it('add additional feature to the subActions', async () => {
    const plugin = {
      install (components) {
        components.subActions.getName = () => {
          return 'John Doe'
        }
      }
    }

    VuexORM.use(plugin)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    expect(await store.dispatch('entities/users/getName')).toBe('John Doe')
  })

  it('add additional feature to the mutations', () => {
    const plugin = {
      install (components) {
        components.mutations.setName = (state, name) => {
          state.name = name
        }
      }
    }

    VuexORM.use(plugin)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    store.commit('entities/setName', 'my_entities')

    expect(store.state.entities.name).toBe('my_entities')
  })

  it('can take extra options', () => {
    const plugin = {
      install (components, options) {
        components.Repo.version = () => {
          return options.version
        }
      }
    }

    VuexORM.use(plugin, { version: '1.0.0' })

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    expect(Repo.version()).toBe('1.0.0')
  })
})
