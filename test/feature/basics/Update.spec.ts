import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Basics – Update', () => {
  it('can update record by including primary key in the data', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @Attribute('')
      name!: string

      // @Attribute
      age!: number

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    createStore([{ model: User }])

    await User.create({
      data: { id: 0, name: 'John Doe', age: 30 }
    })

    await User.update({ id: 0, age: 24 })

    const user = User.find(0) as User

    expect(user.name).toBe('John Doe')
    expect(user.age).toBe(24)
  })

  it('can update record by including custom primary key in the data', async () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'user_id'

      static fields() {
        return {
          user_id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { user_id: 1, name: 'John Doe', age: 30 }
    })

    await store.dispatch('entities/users/update', { user_id: 1, age: 24 })

    const user = store.state.entities.users.data['1']

    expect(user.name).toBe('John Doe')
    expect(user.age).toBe(24)
  })

  it('can update record by including composite primary key in the data', async () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = ['key_1', 'key_2']

      static fields() {
        return {
          key_1: this.attr(null),
          key_2: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { key_1: 1, key_2: 2, name: 'John Doe', age: 30 }
    })

    await store.dispatch('entities/users/update', {
      key_1: 1,
      key_2: 2,
      age: 24
    })

    const user = store.getters['entities/users/query']()
      .where('key_1', 1)
      .where('key_2', 2)
      .first()

    expect(user.name).toBe('John Doe')
    expect(user.age).toBe(24)
  })

  it('can update record by passing an array', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 0, name: 'John Doe', age: 30 },
        { id: 1, name: 'Jane Doe', age: 24 }
      ]
    })

    await store.dispatch('entities/users/update', [
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

  it('can update record by passing an array as a data', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 0, name: 'John Doe', age: 30 },
        { id: 1, name: 'Jane Doe', age: 24 }
      ]
    })

    await store.dispatch('entities/users/update', {
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

  it('can update record by specifying condition with id', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe', age: 30 }
    })

    await store.dispatch('entities/users/update', {
      where: 1,
      data: { age: 24 }
    })

    const user = store.state.entities.users.data['1']

    expect(user.name).toBe('John Doe')
    expect(user.age).toBe(24)
  })

  it('can update record by specifying condition with id of string', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe', age: 30 }
    })

    await store.dispatch('entities/users/update', {
      where: '1',
      data(user: any) {
        user.age = 24
      }
    })

    const user = store.state.entities.users.data['1']

    expect(user.name).toBe('John Doe')
    expect(user.age).toBe(24)
  })

  it('can update record by specifying condition with composite id', async () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = ['key_1', 'key_2']

      static fields() {
        return {
          key_1: this.attr(null),
          key_2: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { key_1: 1, key_2: 2, name: 'John Doe', age: 30 }
    })

    await store.dispatch('entities/users/update', {
      data: { age: 24 },
      where: [1, 2]
    })

    const user = store.getters['entities/users/query']().first()
    expect(user.key_1).toBe(1)
    expect(user.key_2).toBe(2)
    expect(user.age).toBe(24)
  })

  it('can update record by specifying condition with closure', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'JD', age: 30 },
        { id: 2, name: 'JD', age: 30 },
        { id: 3, name: 'Johnny', age: 20 }
      ]
    })

    await store.dispatch('entities/users/update', {
      where(record: any) {
        return record.name === 'JD'
      },
      data: { age: 24 }
    })

    const users = store.state.entities.users.data

    expect(users['1'].age).toBe(24)
    expect(users['2'].age).toBe(24)
    expect(users['3'].age).toBe(20)
  })

  it('can update record by specifying data with closure', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'JD', age: 30 },
        { id: 2, name: 'JD', age: 30 },
        { id: 3, name: 'Johnny', age: 20 }
      ]
    })

    await store.dispatch('entities/users/update', {
      where: 1,
      data(record: any) {
        record.name = 'John Doe'
        record.age = 24
      }
    })

    const user = store.getters['entities/users/find'](1)

    expect(user.name).toBe('John Doe')
    expect(user.age).toBe(24)
  })

  it('does nothing if the specified id can not be found', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [{ id: 1, name: 'JD', age: 30 }]
    })

    await store.dispatch('entities/users/update', {
      where: 2,
      data(user: any) {
        user.name = 'John Doe'
        user.age = 24
      }
    })

    const user = store.getters['entities/users/find'](2)

    expect(user).toBe(null)
  })

  it('can update record by specifying data and where with closure', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'JD', age: 30 },
        { id: 2, name: 'JD', age: 30 },
        { id: 3, name: 'Johnny', age: 20 }
      ]
    })

    await store.dispatch('entities/users/update', {
      where(record: any) {
        return record.name === 'JD'
      },

      data(record: any) {
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

      static fields() {
        return {
          id: this.attr(null),
          parameters: this.attr([])
        }
      }
    }

    const store = createStore([{ model: User }])

    await await store.dispatch('entities/users/create', {
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

      static fields() {
        return {
          id: this.attr(null),
          settings: this.attr({})
        }
      }
    }

    const store = createStore([{ model: User }])

    await await store.dispatch('entities/users/create', {
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

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    await await store.dispatch('entities/users/create', {
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

  it('does nothing if the condition did not match', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe', age: 30 }
    })

    await store.dispatch('entities/users/update', { id: 2, age: 24 })
    await store.dispatch('entities/users/update', { user_id: 2, age: 24 })

    const user = store.getters['entities/users/find'](1)

    expect(user.name).toBe('John Doe')
    expect(user.age).toBe(30)
  })

  it('throws error when the `data` is closure and there is no condition', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe', age: 30 }
    })

    try {
      await store.dispatch('entities/users/update', {
        data(user: any) {
          user.age = 24
        }
      })
    } catch (e) {
      expect(e.message).toBe(
        'You must specify `where` to update records by specifying `data` as a closure.'
      )
    }
  })

  it('throws error when the condition is specified but model has composite key defined', async () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = ['id1', 'id2']

      static fields() {
        return {
          id1: this.attr(null),
          id2: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id1: 1, id2: 2, name: 'John Doe', age: 30 }
    })

    try {
      await store.dispatch('entities/users/update', {
        where: 1,
        data: { age: 24 }
      })
    } catch (e) {
      expect(e.message).toBe(
        "[Vuex ORM] You can't specify `where` value as `string` or `number` " +
          'when you have a composite key defined in your model. Please include ' +
          'composite keys to the `data` fields.'
      )
    }
  })

  it('updates index key when primary key gets updated', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    createStore([{ model: User }])

    await User.create({
      data: { id: 1, name: 'John Doe' }
    })

    await User.update({
      where: 1,
      data: { id: 2 }
    })

    const user: any = User.find(2)
    const count: any = User.query().count()

    expect(user.$id).toBe('2')
    expect(user.id).toBe(2)
    expect(count).toBe(1)
  })

  it('returns a updated object', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe', age: 30 }
    })

    const collection = await store.dispatch('entities/users/update', {
      id: 1,
      age: 24
    })

    expect(collection.users[0]).toBeInstanceOf(User)
    expect(collection.users[0].age).toBe(24)
  })

  it('returns a updated object with specifying where condition', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe', age: 30 }
    })

    const result = await store.dispatch('entities/users/update', {
      where: 1,
      data: { age: 24 }
    })

    expect(result).toBeInstanceOf(User)
    expect(result.age).toBe(24)
  })
})
