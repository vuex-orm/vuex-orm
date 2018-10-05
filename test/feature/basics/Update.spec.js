import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Basics – Update', () => {
  it('can update record by including primary key in the data', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: { id: 0, name: 'John Doe', age: 30 }
    })

    store.dispatch('entities/users/update', { id: 0, age: 24 })

    const user = store.getters['entities/users/find'](0)

    expect(user.name).toBe('John Doe')
    expect(user.age).toBe(24)
  })

  it('can update record by including custom primary key in the data', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'user_id'

      static fields () {
        return {
          user_id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: { user_id: 1, name: 'John Doe', age: 30 }
    })

    store.dispatch('entities/users/update', { user_id: 1, age: 24 })

    const user = store.state.entities.users.data['1']

    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe('John Doe')
    expect(user.age).toBe(24)
  })

  it('can update record by including composite primary key in the data', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = ['key_1', 'key_2']

      static fields () {
        return {
          key_1: this.attr(null),
          key_2: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: { key_1: 1, key_2: 2, name: 'John Doe', age: 30 }
    })

    store.dispatch('entities/users/update', { key_1: 1, key_2: 2, age: 24 })

    const user = store.getters['entities/users']().where('key_1', 1).where('key_2', 2).first()

    expect(user.name).toBe('John Doe')
    expect(user.age).toBe(24)
  })

  it('can update record passing array', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 0, name: 'John Doe', age: 30 },
        { id: 1, name: 'Jane Doe', age: 24 }
      ]
    })

    store.dispatch('entities/users/update', [
      { id: 0, age: 24 },
      { id: 1, age: 30 }
    ])

    const user0 = store.getters['entities/users/find'](0)
    const user1 = store.getters['entities/users/find'](1)

    expect(user0.name).toBe('John Doe')
    expect(user0.age).toBe(24)
    expect(user1.name).toBe('Jane Doe')
    expect(user1.age).toBe(30)
  })

  it('can update record passing array as a data', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 0, name: 'John Doe', age: 30 },
        { id: 1, name: 'Jane Doe', age: 24 }
      ]
    })

    store.dispatch('entities/users/update', {
      data: [
        { id: 0, age: 24 },
        { id: 1, age: 30 }
      ]
    })

    const user0 = store.getters['entities/users/find'](0)
    const user1 = store.getters['entities/users/find'](1)

    expect(user0.name).toBe('John Doe')
    expect(user0.age).toBe(24)
    expect(user1.name).toBe('Jane Doe')
    expect(user1.age).toBe(30)
  })

  it('can update record by specifying condition with id', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe', age: 30 }
    })

    store.dispatch('entities/users/update', {
      where: 1,
      data: { age: 24 }
    })

    const user = store.state.entities.users.data['1']

    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe('John Doe')
    expect(user.age).toBe(24)
  })

  it('can update record by specifying condition with closure', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'JD', age: 30 },
        { id: 2, name: 'JD', age: 30 },
        { id: 3, name: 'Johnny', age: 20 }
      ]
    })

    store.dispatch('entities/users/update', {
      where (record) {
        return record.name === 'JD'
      },
      data: { age: 24 }
    })

    const users = store.state.entities.users.data

    expect(users['1']).toBeInstanceOf(User)
    expect(users['2']).toBeInstanceOf(User)
    expect(users['3']).toBeInstanceOf(User)
    expect(users['1'].age).toBe(24)
    expect(users['2'].age).toBe(24)
    expect(users['3'].age).toBe(20)
  })

  it('can update record by specifying data with closure', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'JD', age: 30 },
        { id: 2, name: 'JD', age: 30 },
        { id: 3, name: 'Johnny', age: 20 }
      ]
    })

    store.dispatch('entities/users/update', {
      where: 1,
      data (record) {
        record.name = 'John Doe'
        record.age = 24
      }
    })

    const user = store.getters['entities/users/find'](1)

    expect(user.name).toBe('John Doe')
    expect(user.age).toBe(24)
  })

  it('can update record by specifying data and where with closure', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'JD', age: 30 },
        { id: 2, name: 'JD', age: 30 },
        { id: 3, name: 'Johnny', age: 20 }
      ]
    })

    store.dispatch('entities/users/update', {
      where (record) {
        return record.name === 'JD'
      },

      data (record) {
        record.age = 24
      }
    })

    const users = store.getters['entities/users/all']()

    expect(users[0].age).toBe(24)
    expect(users[1].age).toBe(24)
    expect(users[2].age).toBe(20)
  })

  it('can update array field', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          parameters: this.attr([])
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 1, parameters: [1, 2] }
    })

    await store.dispatch('entities/users/update', {
      id: 1,
      parameters: [3]
    })

    const user = store.getters['entities/users/find'](1)

    expect(user.parameters).toEqual([3])
  })

  it('can update object field', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          settings: this.attr({})
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 1, settings: { role: 'admin' } }
    })

    await store.dispatch('entities/users/update', {
      id: 1,
      settings: { active: true }
    })

    const user = store.getters['entities/users/find'](1)

    expect(user.settings).toEqual({ active: true })
  })

  it('ignores field which is not defined at model schema', async () => {
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

    await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    await store.dispatch('entities/users/update', {
      id: 1,
      name: 'Jane Doe',
      age: 24
    })

    const user = store.getters['entities/users/find'](1)

    expect(user.name).toBe('Jane Doe')
    expect(user.age).toBe(undefined)
  })

  it('does nothing if the condition did not match', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe', age: 30 }
    })

    store.dispatch('entities/users/update', { id: 2, age: 24 })
    store.dispatch('entities/users/update', { user_id: 2, age: 24 })

    const user = store.getters['entities/users/find'](1)

    expect(user.name).toBe('John Doe')
    expect(user.age).toBe(30)
  })

  it('throws error when the `data` is closure and there is no condition', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe', age: 30 }
    })

    try {
      await store.dispatch('entities/users/update', {
        data (user) {
          user.age = 24
        }
      })
    } catch (e) {
      expect(e.message).toBe('You must specify `where` to update records by specifying `data` as a closure.')
    }
  })

  it('throws error when the condition is specified but model has composite key defined', async () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = ['id1', 'id2']

      static fields () {
        return {
          id1: this.attr(null),
          id2: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: { id1: 1, id2: 2, name: 'John Doe', age: 30 }
    })

    try {
      await store.dispatch('entities/users/update', {
        where: 1,
        data: { age: 24 }
      })
    } catch (e) {
      expect(e.message).toBe(`
        You can't specify \`where\` value as \`string\` or \`number\` when you
        have a composite key defined in your model. Please include composite
        keys to the \`data\` fields.
      `)
    }
  })

  it('returns a updated object', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe', age: 30 }
    })

    const collection = await store.dispatch('entities/users/update', { id: 1, age: 24 })

    expect(collection.users[0]).toBeInstanceOf(User)
    expect(collection.users[0].age).toBe(24)
  })

  it('returns a updated object with specifying where condition', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe', age: 30 }
    })

    const result = await store.dispatch('entities/users/update', {
      where: 1,
      data: { age: 24 }
    })

    expect(result.users[0]).toBeInstanceOf(User)
    expect(result.users[0].age).toBe(24)
  })
})
