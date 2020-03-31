import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@/index'
import Database from '@/database/Database'
import Model from '@/model/Model'

Vue.use(Vuex)

describe('Feature – Database - Register Model', () => {
  class User extends Model {
    static entity = 'users'

    static fields() {
      return {
        id: this.uid(),
        name: this.string('')
      }
    }
  }

  class Hobby extends Model {
    static entity = 'hobbies'

    static fields() {
      return {
        id: this.uid(),
        user_id: this.attr(null),
        name: this.string(''),
        user: this.belongsTo(User, 'user_id')
      }
    }
  }

  const userModule = {
    state: {
      currentId: null
    },

    getters: {
      current: (state: any) => () => state.data[state.currentId]
    },

    mutations: {
      setCurrent(state: any, id: number) {
        state.currentId = id
      }
    },

    actions: {
      login({ commit, state }: any, name: string) {
        const id = Object.keys(state.data).find(
          (key) => state.data[key].name === name
        )
        commit('setCurrent', id)
      },

      logout({ commit }: any) {
        commit('setCurrent', null)
      }
    }
  }

  it('can register models before being installed to vuex.', async () => {
    const database = new Database()

    database.register(User)
    database.register(Hobby)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)],
      strict: true
    })

    await store.dispatch('entities/hobbies/create', {
      data: {
        name: 'my hobby',
        user: {
          name: 'my name'
        }
      }
    })

    const hobby = store.getters['entities/hobbies/query']()
      .with('user')
      .first()
    const user = store.getters['entities/users/query']().first()

    expect(hobby.name).toEqual('my hobby')
    expect(hobby.user.name).toEqual('my name')
    expect(user.name).toEqual('my name')
  })

  it('can register modules before being installed to vuex.', async () => {
    const database = new Database()

    database.register(User, userModule)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)],
      strict: true
    })

    await store.dispatch('entities/users/create', {
      data: [{ name: 'user 1' }, { name: 'user 2' }, { name: 'user 3' }]
    })

    const user = store.getters['entities/users/query']()
      .where('name', 'user 2')
      .first()
    const getCurrentUser = store.getters['entities/users/current']

    expect(getCurrentUser()).toBeUndefined()

    await store.dispatch('entities/users/login', 'user 2')
    expect(getCurrentUser()).toEqual(user)

    await store.dispatch('entities/users/logout')
    expect(getCurrentUser()).toBeUndefined()
  })

  it('can register models after being installed to vuex.', async () => {
    const database = new Database()

    database.register(User)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)],
      strict: true
    })

    database.register(Hobby)

    await store.dispatch('entities/hobbies/create', {
      data: {
        name: 'my hobby',
        user: {
          name: 'my name'
        }
      }
    })

    const hobby = store.getters['entities/hobbies/query']()
      .with('user')
      .first()
    const user = store.getters['entities/users/query']().first()

    expect(hobby.name).toEqual('my hobby')
    expect(hobby.user.name).toEqual('my name')
    expect(user.name).toEqual('my name')
  })

  it('can register modules after being installed to vuex.', async () => {
    const database = new Database()

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)],
      strict: true
    })

    database.register(User, userModule)

    await store.dispatch('entities/users/create', {
      data: [{ name: 'user 1' }, { name: 'user 2' }, { name: 'user 3' }]
    })

    const user = store.getters['entities/users/query']()
      .where('name', 'user 2')
      .first()
    const getCurrentUser = store.getters['entities/users/current']

    expect(getCurrentUser()).toBeUndefined()

    await store.dispatch('entities/users/login', 'user 2')
    expect(getCurrentUser()).toEqual(user)

    await store.dispatch('entities/users/logout')
    expect(getCurrentUser()).toBeUndefined()
  })

  it('preserves state of previously registered models', async () => {
    const database = new Database()

    database.register(User)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)],
      strict: true
    })

    await store.dispatch('entities/users/create', { data: { name: 'my name' } })

    database.register(Hobby)

    const user = store.getters['entities/users/query']().first()

    expect(user.name).toEqual('my name')
  })
})
