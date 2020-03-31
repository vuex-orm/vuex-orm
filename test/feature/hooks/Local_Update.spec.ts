import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Hooks – Local Update', () => {
  it('can dispatch the `beforeUpdate` hook that modifies the data being updated', async () => {
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

      static beforeUpdate(user: User) {
        user.age = 30
      }
    }

    createStore([{ model: User }])

    await User.insert({ id: 1, name: 'John Doe', age: 20 })

    await User.update({ id: 1, name: 'Jane Doe' })

    const expected = { $id: '1', id: 1, name: 'Jane Doe', age: 30 }

    expect(User.find(1)).toEqual(expected)
  })

  it('it will update the record as is if the `beforeUpdate` hook returns nothing', async () => {
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

      static beforeUpdate(_user: User) {
        // Do nothing.
      }
    }

    createStore([{ model: User }])

    await User.insert({ id: 1, name: 'John Doe', age: 20 })

    await User.update({ id: 1, name: 'Jane Doe', age: 30 })

    const expected = { $id: '1', id: 1, name: 'Jane Doe', age: 30 }

    expect(User.find(1)).toEqual(expected)
  })

  it('can cancel the update by returning false from `beforeUpdate` hook', async () => {
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

      static beforeUpdate(_user: User) {
        return false
      }
    }

    createStore([{ model: User }])

    await User.insert([
      { id: 1, name: 'John Doe', age: 20 },
      { id: 2, name: 'Jane Doe', age: 24 }
    ])

    await User.update({ id: 1, name: 'Johnny Doe' })

    const users = User.all()

    expect(users.length).toBe(2)
    expect(users[0].id).toBe(1)
    expect(users[0].name).toBe('John Doe')
  })

  it('can dispatch the `afterUpdate` hook', async () => {
    let hit = null

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

      static afterUpdate(user: User) {
        hit = true

        expect(user).toBeInstanceOf(User)
        expect(user.id).toBe(1)
        expect(user.age).toBe(30)
      }
    }

    createStore([{ model: User }])

    await User.insert({ id: 1, name: 'John Doe', age: 20 })

    await User.update({ id: 1, age: 30 })

    expect(hit).toBe(true)
  })
})
