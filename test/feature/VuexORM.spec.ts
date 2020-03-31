import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@/index'

describe('Feature – Vuex ORM', () => {
  Vue.use(Vuex)

  class User extends VuexORM.Model {
    static entity = 'users'
  }

  class Post extends VuexORM.Model {
    static entity = 'posts'
  }

  const users = {}
  const posts = {}

  it('can install Vuex ORM to the Vuex', () => {
    const database = new VuexORM.Database()

    database.register(User, users)
    database.register(Post, posts)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    expect(store.state.entities.$name).toBe('entities')
    expect(store.state.entities.users.$name).toBe('users')
    expect(store.state.entities.posts.$name).toBe('posts')
  })

  it('can omit modules', () => {
    const database = new VuexORM.Database()

    database.register(User)
    database.register(Post)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    expect(store.state.entities.$name).toBe('entities')
    expect(store.state.entities.users.$name).toBe('users')
    expect(store.state.entities.posts.$name).toBe('posts')
  })

  it('can install Vuex ORM to the Vuex under a custom namespace', () => {
    const database = new VuexORM.Database()

    database.register(User, users)
    database.register(Post, posts)

    const options = { namespace: 'my_entities' }

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database, options)]
    })

    expect(store.state.my_entities.$name).toBe('my_entities')
    expect(store.state.my_entities.users.$name).toBe('users')
    expect(store.state.my_entities.posts.$name).toBe('posts')
  })

  it('can install Vuex ORM along with custom state as a function', () => {
    const database = new VuexORM.Database()

    const users = {
      state() {
        return {
          customState: 'Yes, it is custom'
        }
      }
    }

    database.register(User, users)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    expect(store.state.entities.users.$name).toBe('users')
    expect(store.state.entities.users.customState).toBe('Yes, it is custom')
  })
})
