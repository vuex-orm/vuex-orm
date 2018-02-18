import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Repo from 'app/repo/Repo'
import Data from 'app/data/Data'

describe('Data – Normalize', () => {
  it('can normalize a data', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    const repo = new Repo(store.state.entities, 'users')

    const data = { id: 1, name: 'John Doe' }

    const expected = {
      users: {
        '1': { $id: 1, id: 1, name: 'John Doe' }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can normalize list of data', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    const repo = new Repo(store.state.entities, 'users')

    const data = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ]

    const expected = {
      users: {
        '1': { $id: 1, id: 1, name: 'John Doe' },
        '2': { $id: 2, id: 2, name: 'Jane Doe' }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('sets proper $id key when the model has a custom primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'user_id'

      static fields () {
        return {
          user_id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    const repo = new Repo(store.state.entities, 'users')

    const data = [
      { user_id: 1, name: 'John Doe' },
      { user_id: 2, name: 'Jane Doe' }
    ]

    const expected = {
      users: {
        '1': { $id: 1, user_id: 1, name: 'John Doe' },
        '2': { $id: 2, user_id: 2, name: 'Jane Doe' }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('generates unique key if the primary key is missing in data', () => {
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

    const data = [
      { name: 'John' },
      { name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' }
    ]

    const expected = {
      users: {
        '_no_key_1': { $id: '_no_key_1', name: 'John' },
        '_no_key_2': { $id: '_no_key_2', name: 'Jane Doe' },
        '3': { $id: 3, id: 3, name: 'Johnny Doe' }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can normalize a nested fields', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          settings: {
            email: this.attr(''),
            role: this.attr('')
          }
        }
      }
    }

    const store = createStore([{ model: User }])

    const repo = new Repo(store.state.entities, 'users')

    const data = {
      id: 1,
      name: 'John Doe',
      settings: {
        email: 'john.doe@example.com',
        role: 'admin'
      }
    }

    const expected = {
      users: {
        '1': {
          $id: 1,
          id: 1,
          name: 'John Doe',
          settings: {
            email: 'john.doe@example.com',
            role: 'admin'
          }
        }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can normalize list of nested fields', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          settings: {
            email: this.attr(''),
            role: this.attr('')
          }
        }
      }
    }

    const store = createStore([{ model: User }])

    const repo = new Repo(store.state.entities, 'users')

    const data = [
      {
        id: 1,
        name: 'John Doe',
        settings: {
          email: 'john.doe@example.com',
          role: 'admin'
        }
      },
      {
        id: 2,
        name: 'Jane Doe',
        settings: {
          email: 'jane.doe@example.com',
          role: 'user'
        }
      }
    ]

    const expected = {
      users: {
        '1': {
          $id: 1,
          id: 1,
          name: 'John Doe',
          settings: {
            email: 'john.doe@example.com',
            role: 'admin'
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

    expect(Data.normalize(data, repo)).toEqual(expected)
  })
})
