import { createStore } from 'test/support/Helpers'
import { Model, Fields } from 'app/index'

describe('Hooks – Local Binding', () => {
  it('should be scoped to the model class', async () => {
    class User extends Model {
      static entity = 'users'

      static fields (): Fields {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }

      static beforeCreate (user: User): void {
        this.setAge(user)
      }

      static setAge (user: User): void {
        user.age = 30
      }

      id!: any
      name!: any
      age!: any
    }

    createStore([{ model: User }])

    await User.insert({
      data: { id: 1, name: 'John Doe', age: 20 }
    })

    const user = User.find(1)

    const expected = { $id: '1', id: 1, name: 'John Doe', age: 30 }

    expect(user).toEqual(expected)
  })
})
