import getters from 'app/modules/rootGetters'
import actions from 'app/modules/rootActions'
import mutations from 'app/modules/mutations'
import subActions from 'app/modules/subActions'
import subGetters from 'app/modules/subGetters'
import Model from 'app/model/Model'
import Database from 'app/database/Database'

describe('Unit – Database', () => {
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
})
