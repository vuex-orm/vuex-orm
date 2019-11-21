import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Basics – New', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.increment(null),
        name: this.attr('Default Doe')
      }
    }
  }

  it('can create new data with all fields filled by default values', async () => {
    const store = createStore([{ model: User }])

    await User.new()
    await User.new()

    expect(store.state.entities.users.data.$uuid1.$id).toBe('$uuid1')
    expect(store.state.entities.users.data.$uuid1.id).toBe('$uuid1')
    expect(store.state.entities.users.data.$uuid1.name).toBe('Default Doe')

    expect(store.state.entities.users.data.$uuid2.$id).toBe('$uuid2')
    expect(store.state.entities.users.data.$uuid2.id).toBe('$uuid2')
    expect(store.state.entities.users.data.$uuid2.name).toBe('Default Doe')
  })

  it('returns newly created instance', async () => {
    createStore([{ model: User }])

    const user = await User.new()

    expect(user.$id).toBe('$uuid3')
    expect(user.id).toBe('$uuid3')
    expect(user.name).toBe('Default Doe')
  })
})
