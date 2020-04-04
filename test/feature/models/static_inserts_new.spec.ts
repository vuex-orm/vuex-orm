import { createStore, createState } from 'test/support/Helpers'
import Uid from '@/support/Uid'
import { Model } from '@/index'

describe('feature/query/inserts_new', () => {
  class User extends Model {
    static entity = 'users'

    static fields() {
      return {
        id: this.uid(),
        name: this.attr('John Doe')
      }
    }

    id!: string
    name!: string
  }

  beforeEach(() => {
    Uid.reset()
  })

  it('can create new data with all fields filled by default values', async () => {
    const store = createStore([User])

    await User.new()
    await User.new()

    const expected = createState({
      users: {
        $uid1: { $id: '$uid1', id: '$uid1', name: 'John Doe' },
        $uid2: { $id: '$uid2', id: '$uid2', name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('returns a newly created model', async () => {
    createStore([User])

    const user = await User.new()

    expect(user).toBeInstanceOf(User)
    expect(user.$id).toBe('$uid1')
    expect(user.id).toBe('$uid1')
    expect(user.name).toBe('John Doe')
  })
})
