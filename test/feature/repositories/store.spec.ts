import { createStore } from 'test/support/Helpers'
import { Model, Repository } from 'app/index'

describe('Feature - Repositories - Store', () => {
  it('can retrieve a new repository instance from the store', () => {
    class User extends Model {
      static entity = 'users'
    }

    const store = createStore([User])

    const user = store.$repo(User)

    expect(user).toBeInstanceOf(Repository)
  })
})
