import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from 'app/index'
import Database from 'app/database/Database'
import Model from 'app/model/Model'

import RootGetters from 'app/modules/RootGetters'

Vue.use(Vuex)

describe('Feature – Database - Register Model', () => {
  afterEach(() => { // TODO because app/modules/builder/Builder.ts#L44 modifies RootGetters in place
    delete RootGetters.users
    delete RootGetters.hobbies
  })

  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.increment(),
        name: this.string()
      }
    }
  }

  class Hobby extends Model {
    static entity = 'hobbies'

    static fields () {
      return {
        id: this.increment(),
        name: this.string(),
        userId: this.attr(),
        user: this.belongsTo(User, 'userId')
      }
    }
  }

  it('can register models before being installed to vuex.', async () => {
    const database = new Database()

    database.register(User)
    database.register(Hobby) // TODO custom module?

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

    const hobby = store.getters['entities/hobbies/query']().with('user').first()
    const user = store.getters['entities/users/query']().first()

    expect(hobby.name).toEqual('my hobby')
    expect(hobby.user.name).toEqual('my name')
    expect(user.name).toEqual('my name')
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

    const hobby = store.getters['entities/hobbies/query']().with('user').first()
    const user = store.getters['entities/users/query']().first()

    expect(hobby.name).toEqual('my hobby')
    expect(hobby.user.name).toEqual('my name')
    expect(user.name).toEqual('my name')
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

  it('can register the getter "${namespace}/${name}".', async () => {
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

    expect(store.getters['entities/users']().first().name).toEqual('my name')
    expect(store.getters['entities/hobbies']().first().name).toEqual('my hobby')

  })
})
