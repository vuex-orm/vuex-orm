import getters from 'app/modules/rootGetters'
import actions from 'app/modules/rootActions'
import mutations from 'app/modules/mutations'
import subActions from 'app/modules/subActions'
import subGetters from 'app/modules/subGetters'
import Model from 'app/model/Model'
import Database from 'app/database/Database'

describe('Database', () => {
  class User extends Model {
    static entity = 'users'
  }

  class Post extends Model {
    static entity = 'posts'
    static primaryKey = 'customId'
  }

  const users = {
    state: {},
    actions: {}
  }

  const posts = {
    state () {},
    mutations: {}
  }

  it('can register models', () => {
    const database = new Database()

    const expected = [
      { name: 'users', model: User, module: users },
      { name: 'posts', model: Post, module: posts }
    ]

    database.register(User, users)
    database.register(Post, posts)

    expect(database.entities).toEqual(expected)
  })

  it('can generate Vuex Module Tree from registered entities', () => {
    const database = new Database()

    database.register(User, users)
    database.register(Post, posts)

    const expected = {
      namespaced: true,
      state: { $name: 'entities', },
      getters,
      actions,
      mutations,

      modules: {
        users: {
          namespaced: true,
          state: { $connection: 'entities', $name: 'users', data: {} },
          getters: subGetters,
          actions: subActions,
          mutations: {}
        },
        posts: {
          namespaced: true,
          state: { $connection: 'entities', $name: 'posts', data: {} },
          getters: subGetters,
          actions: subActions,
          mutations: {}
        }
      }
    }

    expect(database.createModule('entities')).toEqual(expected)
  })
})
