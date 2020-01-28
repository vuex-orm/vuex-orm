import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Basics – New', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.uid(),
        name: this.attr('Default Doe')
      }
    }
  }

  it('can create new data with all fields filled by default values', async () => {
    const store = createStore([{ model: User }])

    await User.new()
    await User.new()

    expect(store.state.entities.users.data.$uid1.$id).toBe('$uid1')
    expect(store.state.entities.users.data.$uid1.id).toBe('$uid1')
    expect(store.state.entities.users.data.$uid1.name).toBe('Default Doe')

    expect(store.state.entities.users.data.$uid2.$id).toBe('$uid2')
    expect(store.state.entities.users.data.$uid2.id).toBe('$uid2')
    expect(store.state.entities.users.data.$uid2.name).toBe('Default Doe')
  })

  it('returns newly created instance', async () => {
    createStore([{ model: User }])

    const user = await User.new()

    expect(user.$id).toBe('$uid3')
    expect(user.id).toBe('$uid3')
    expect(user.name).toBe('Default Doe')
  })
})
