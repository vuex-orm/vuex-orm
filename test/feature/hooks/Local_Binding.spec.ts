import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Hooks – Local Binding', () => {
  it('should be scoped to the model class', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @Attribute('')
      name!: string

      // @Attribute
      age!: number

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }

      static beforeCreate (user: User) {
        this.setAge(user)
      }

      static setAge (user: User) {
        user.age = 30
      }
    }

    createStore([{ model: User }])

    await User.insert({ id: 1, name: 'John Doe', age: 20 })

    const expected = { $id: '1', id: 1, name: 'John Doe', age: 30 }

    expect(User.find(1)).toEqual(expected)
  })
})
