import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Hooks – Local Insert', () => {
  it('can dispatch the `beforeCreate` hook that modifies the data being inserted', async () => {
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

      static beforeCreate(record: User) {
        record.age = 30
      }
    }

    createStore([{ model: User }])

    await User.insert({
      data: { id: 1, name: 'John Doe', age: 20 }
    })

    const expected = { $id: '1', id: 1, name: 'John Doe', age: 30 }

    expect(User.find(1)).toEqual(expected)
  })

  it('it will insert the record as is if the `beforeCreate` hook returns nothing', async () => {
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

      static beforeCreate(_record: User) {
        // Do nothing.
      }
    }

    createStore([{ model: User }])

    await User.insert({
      data: { id: 1, name: 'John Doe', age: 20 }
    })

    const expected = { $id: '1', id: 1, name: 'John Doe', age: 20 }

    expect(User.find(1)).toEqual(expected)
  })

  it('can cancel the insert by returning false from `beforeCreate` hook', async () => {
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

      static beforeCreate(record: User): boolean | void {
        if (record.age === 20) {
          return false
        }
      }
    }

    createStore([{ model: User }])

    await User.insert({
      data: [
        { id: 1, name: 'John Doe', age: 20 },
        { id: 2, name: 'Jane Doe', age: 24 }
      ]
    })

    const users = User.all()

    expect(users.length).toBe(1)
    expect(users[0].id).toBe(2)
  })

  it('can dispatch the `afterCreate` hook', async () => {
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

      static afterCreate(record: User) {
        expect(record).toBeInstanceOf(User)
        expect(record.id).toBe(1)
      }
    }

    createStore([{ model: User }])

    await User.insert({
      data: { id: 1, name: 'John Doe', age: 20 }
    })
  })
})
