import { createStore } from 'test/support/Helpers'
import { Model } from 'app/index'

describe('Unit - Repository', () => {
  it('can instantiate a new model instance without a record', () => {
    class User extends Model {
      static entity = 'users'
    }

    const store = createStore([User])

    const userRepo = store.$repo(User)

    expect(userRepo.make()).toBeInstanceOf(User)
  })

  it('can instantiate a new model instance with a record', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(''),
          name: this.attr('')
        }
      }

      name!: string
    }

    const store = createStore([User])

    const userRepo = store.$repo(User)

    const user = userRepo.make({ name: 'John Doe' })

    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe('John Doe')
  })
})
