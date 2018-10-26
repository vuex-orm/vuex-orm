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

    expect(store.state.entities.users.data['1']).toBeInstanceOf(User)
    expect(store.state.entities.users.data['1'].$id).toBe(1)
    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['1'].name).toBe('Default Doe')

    expect(store.state.entities.users.data['2']).toBeInstanceOf(User)
    expect(store.state.entities.users.data['2'].$id).toBe(2)
    expect(store.state.entities.users.data['2'].id).toBe(2)
    expect(store.state.entities.users.data['2'].name).toBe('Default Doe')
  })

  it('returns newly created instance', async () => {
    const store = createStore([{ model: User }])

    const user = await User.new()

    expect(user).toBeInstanceOf(User)
    expect(user.$id).toBe(1)
    expect(user.id).toBe(1)
    expect(user.name).toBe('Default Doe')
  })
})
