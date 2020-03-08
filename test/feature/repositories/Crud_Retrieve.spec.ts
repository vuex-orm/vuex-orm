import { createStore } from 'test/support/Helpers'
import { Model, Query } from 'app/index'

describe('Feature - Repositories - CRUD Retrieve', () => {
  it('can get a new query instance', () => {
    class User extends Model {
      static entity = 'users'
    }

    const store = createStore([User])

    const query = store.$repo(User).query()

    expect(query).toBeInstanceOf(Query)
  })
})
