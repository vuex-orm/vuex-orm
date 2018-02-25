import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Repo from 'app/repo/Repo'
import Data from 'app/data/Data'

describe('Data – Fill', () => {
  it('sets the default value to the missing field', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('John')
        }
      }
    }

    const store = createStore([{ model: User }])

    const repo = new Repo(store.state.entities, 'users')

    const data = {
      users: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2, name: 'Jane Doe' }
      }
    }

    const expected = {
      users: {
        '1': { $id: 1, id: 1, name: 'John' },
        '2': { $id: 2, id: 2, name: 'Jane Doe' }
      }
    }

    expect(Data.fillAll(data, repo)).toEqual(expected)
  })

  it('removes unknown fields when filling data', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('John')
        }
      }
    }

    const store = createStore([{ model: User }])

    const repo = new Repo(store.state.entities, 'users')

    const data = {
      users: {
        '1': { $id: 1, id: 1, age: 24 },
        '2': { $id: 2, id: 2, name: 'Jane Doe' }
      }
    }

    const expected = {
      users: {
        '1': { $id: 1, id: 1, name: 'John' },
        '2': { $id: 2, id: 2, name: 'Jane Doe' }
      }
    }

    expect(Data.fillAll(data, repo)).toEqual(expected)
  })

  it('sets the default value to the nested missing field', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('John'),
          settings: {
            email: this.attr('john@example.com'),
            role: this.attr('user')
          }
        }
      }
    }

    const store = createStore([{ model: User }])

    const repo = new Repo(store.state.entities, 'users')

    const data = {
      users: {
        '1': { $id: 1, id: 1 },
        '2': {
          $id: 2,
          id: 2,
          name: 'Jane Doe',
          settings: {
            email: 'jane.doe@example.com',
            phone: '012-3456-7890'
          }
        }
      }
    }

    const expected = {
      users: {
        '1': {
          $id: 1,
          id: 1,
          name: 'John',
          settings: {
            email: 'john@example.com',
            role: 'user'
          }
        },
        '2': {
          $id: 2,
          id: 2,
          name: 'Jane Doe',
          settings: {
            email: 'jane.doe@example.com',
            role: 'user'
          }
        }
      }
    }

    expect(Data.fillAll(data, repo)).toEqual(expected)
  })
})
