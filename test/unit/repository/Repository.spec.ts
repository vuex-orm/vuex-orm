import { createStore } from 'test/support/Helpers'
import Repository from '@/repository/Repository'
import Model from '@/model/Model'

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

      // @Attribute('')
      name!: string

      // @Attribute('')
      email!: string

      static fields () {
        return {
          id: this.attr(''),
          name: this.attr('')
        }
      }
    }

    const store = createStore([User])

    const userRepo = store.$repo(User)

    const user = userRepo.make({ name: 'John Doe' })

    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe('John Doe')
  })

  it('can retrieve a custom repository', () => {
    class User extends Model {
      static entity = 'users'
    }

    class UserRepository extends Repository<User> {
      model = User
      foo = 'bar'
    }

    const store = createStore([User])

    const userRepo = store.$repo(UserRepository)

    expect(userRepo.foo).toBe('bar')
  })

  it('throws if the custom repository has no assigned model', () => {
    class User extends Model {
      static entity = 'users'
    }

    class UserRepository extends Repository<User> {
      foo = 'bar'
    }

    const store = createStore([User])

    expect(() => store.$repo(UserRepository)).toThrow()
  })
})
