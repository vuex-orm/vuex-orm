import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from 'app'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Plugin', () => {
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

  it('add additional feature to the Query', async () => {
    const plugin = {
      install (components) {
        components.Query.staticMethod = function () {
          return 'Hello'
        }

        components.Query.prototype.instanceMethod = function () {
          return `${this.self().staticMethod()}, world!`
        }
      }
    }

    VuexORM.use(plugin)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    await store.dispatch('entities/users/create', { data: { id: 1, name: 'John' } })

    const query = store.getters['entities/users/query']()

    expect(query.instanceMethod()).toBe('Hello, world!')
  })

  it('add additional feature to the rootGetters', () => {
    const plugin = {
      install (components) {
        components.RootGetters.getName = (state) => {
          return state.$name
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
        components.Getters.getName = (state) => {
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
        components.RootActions.getName = () => {
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
        components.Actions.getName = () => {
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
        components.RootMutations.setName = (state, name) => {
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
        components.Query.version = () => {
          return options.version
        }
      }
    }

    VuexORM.use(plugin, { version: '1.0.0' })

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    expect(Query.version()).toBe('1.0.0')
  })
})
