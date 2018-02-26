import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Inserts – Create – Nested Field', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('JD'),
        settings: {
          role: this.attr('user'),
          email: this.attr('')
        }
      }
    }
  }

  function getStore () {
    return createStore([{ model: User }])
  }

  it('can create a data with nested field', () => {
    const store = getStore()

    const data = {
      id: 1,
      name: 'John Doe',
      settings: {
        role: 'admin',
        email: 'john@example.com'
      }
    }

    store.dispatch('entities/users/create', { data })

    const users = store.getters['entities/users/all']()

    expect(users.length).toBe(1)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].settings.role).toBe('admin')
    expect(users[0].settings.email).toBe('john@example.com')
  })

  it('can create list of data with nested field', () => {
    const store = getStore()

    const data = [
      {
        id: 1,
        name: 'John Doe',
        settings: {
          role: 'admin',
          email: 'john@example.com'
        }
      },
      {
        id: 2,
        name: 'Jane Doe',
        settings: {
          role: 'sysadmin',
          email: 'jane@example.com'
        }
      }
    ]

    store.dispatch('entities/users/create', { data })

    const users = store.getters['entities/users/all']()

    expect(users.length).toBe(2)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].settings.role).toBe('admin')
    expect(users[0].settings.email).toBe('john@example.com')
    expect(users[1].settings.role).toBe('sysadmin')
    expect(users[1].settings.email).toBe('jane@example.com')
  })

  it('fills missing fields with the default value', () => {
    const store = getStore()

    const data = [
      {
        id: 1,
        name: 'John Doe'
      },
      {
        id: 2,
        name: 'Jane Doe',
        settings: {}
      },
      {
        id: 3,
        name: 'Johnny Doe',
        settings: {
          email: 'johnny@example.com'
        }
      }
    ]

    store.dispatch('entities/users/create', { data })

    const users = store.getters['entities/users/all']()

    expect(users.length).toBe(3)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].settings.role).toBe('user')
    expect(users[0].settings.email).toBe('')
    expect(users[1].settings.role).toBe('user')
    expect(users[1].settings.email).toBe('')
    expect(users[2].settings.role).toBe('user')
    expect(users[2].settings.email).toBe('johnny@example.com')
  })
})
