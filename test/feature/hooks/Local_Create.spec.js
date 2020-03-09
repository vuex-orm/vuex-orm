import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Hooks – Local Create', () => {
  it('can dispatch the `beforeCreate` hook that modifies the data being created', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }

      static beforeCreate (record) {
        record.age = 30
      }
    }

    const store = createStore([{ model: User }])

    await User.create({ id: 1, name: 'John Doe', age: 20 })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'John Doe', age: 30 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('it will create the record as is if the `beforeCreate` hook returns nothing', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }

      static beforeCreate (record) {
        // Do nothing.
      }
    }

    createStore([{ model: User }])

    await User.create({ id: 1, name: 'John Doe', age: 20 })

    const user = User.find(1)

    const expected = new User({ $id: '1', id: 1, name: 'John Doe', age: 20 })

    expect(user).toEqual(expected)
  })

  it('can cancel the create by returning false from `beforeCreate` hook', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }

      static beforeCreate (record) {
        if (record.age === 20) {
          return false
        }
      }
    }

    createStore([{ model: User }])

    await User.create([
      { id: 1, name: 'John Doe', age: 20 },
      { id: 2, name: 'Jane Doe', age: 24 }
    ])

    const result = User.all()

    expect(result.length).toBe(1)
    expect(result[0].id).toBe(2)
  })

  it('can dispatch the `afterCreate` hook', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }

      static afterCreate (model) {
        expect(model).toBeInstanceOf(User)
        expect(model.id).toBe(1)
      }
    }

    createStore([{ model: User }])

    await User.create({ id: 1, name: 'John Doe', age: 20 })
  })
})
