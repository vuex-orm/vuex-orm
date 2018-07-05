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
