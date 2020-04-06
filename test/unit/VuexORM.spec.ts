import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM, { Database, Model } from '@/index'

describe('unit/VuexORM', () => {
  Vue.use(Vuex)

  it('installs Vuex ORM to the store', () => {
    class User extends Model {
      entity = 'users'
    }

    class Post extends Model {
      entity = 'posts'
    }

    const database = new Database()

    database.register(User)
    database.register(Post)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    const expected = {
      entities: {
        users: {
          data: {}
        },
        posts: {
          data: {}
        }
      }
    }

    expect(store.state).toEqual(expected)
    expect(store.$database.started).toBe(true)
  })

  it('can customize the namespace', () => {
    class User extends Model {
      entity = 'users'
    }

    const database = new Database()

    database.register(User)

    const store = new Vuex.Store({
      plugins: [
        VuexORM.install(database, {
          namespace: 'database'
        })
      ]
    })

    const expected = {
      database: {
        users: {
          data: {}
        }
      }
    }

    expect(store.state).toEqual(expected)
  })
})
