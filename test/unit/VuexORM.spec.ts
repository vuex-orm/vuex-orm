import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@/index'
import Database from '@/database/Database'
import Model from '@/model/Model'

describe('unit/VuexORM', () => {
  Vue.use(Vuex)

  it('installs Vuex ORM to the store', () => {
    class User extends Model {
      static entity = 'users'
    }
    class Post extends Model {
      static entity = 'posts'
    }

    const database = new Database()

    database.register(User)
    database.register(Post)

    const store = new Vuex.Store({
      plugins: [VuexORM.install(database)]
    })

    const expected = {
      entities: {
        $name: 'entities',
        users: {
          $name: 'users',
          $connection: 'entities',
          data: {}
        },
        posts: {
          $name: 'posts',
          $connection: 'entities',
          data: {}
        }
      }
    }

    expect(store.state).toEqual(expected)
  })

  it('can customize the namespace', () => {
    class User extends Model {
      static entity = 'users'
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
        $name: 'database',
        users: {
          $name: 'users',
          $connection: 'database',
          data: {}
        }
      }
    }

    expect(store.state).toEqual(expected)
  })
})
