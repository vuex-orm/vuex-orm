import Database from 'app/database/Database'
import Model from 'app/model/Model'

describe('Unit – Database', () => {
  class User extends Model {
    static entity = 'users'

    // Dummy implementation.
    static types () {
      return {}
    }
  }

  class ExtendedUser extends User {
    static entity = 'extended_users'

    static baseEntity = 'users'
  }

  class Post extends Model {
    static entity = 'posts'
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

    database.register(User, users)
    database.register(Post, posts)

    const expected = [
      { name: 'users', base: 'users', model: User, module: users },
      { name: 'posts', base: 'posts', model: Post, module: posts }
    ]

    expect(database.entities).toEqual(expected)
  })

  it('can get a base model of a derived one', () => {
    const database = new Database()

    database.register(User, users)
    database.register(ExtendedUser, extended)
    database.register(Post, posts)

    const base = database.baseModel('extended_users')

    expect(base).toEqual(User)
    expect(base.entity).toEqual('users')
  })
})
