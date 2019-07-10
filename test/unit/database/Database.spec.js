import Model from 'app/model/Model'
import Database from 'app/database/Database'

describe('Unit – Database', () => {
  class User extends Model {
    static entity = 'users'

    // dummy implementation
    static types () {
      return {}
    }
  }

  class ExtendedUser extends User {
    static entity = 'extendedusers'
    static baseEntity = 'users'
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

  const extended = {
    state () {},
    mutations: {}
  }

  it('can register models', () => {
    const database = new Database()

    const expected = [
      { name: 'users', base: 'users', model: User, module: users },
      { name: 'posts', base: 'posts', model: Post, module: posts }
    ]

    database.register(User, users)
    database.register(Post, posts)

    expect(database.entities).toEqual(expected)
  })

  it('can get base model of a derived one', () => {
    const database = new Database()
    database.register(User, users)
    database.register(Post, posts)
    database.register(ExtendedUser, extended)

    const base = database.baseModel('extendedusers')
    expect(base).toEqual(User)
    expect(base.entity).toEqual('users')
  })
})
