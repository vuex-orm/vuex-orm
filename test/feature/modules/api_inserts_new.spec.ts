import { createStore, createState } from 'test/support/Helpers'
import Uid from '@/support/Uid'
import { Model } from '@/index'

describe('feature/modules/api_inserts_new', () => {
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

    await store.dispatch('entities/users/new')
    await store.dispatch('entities/users/new')

    const expected = createState({
      users: {
        $uid1: { $id: '$uid1', id: '$uid1', name: 'John Doe' },
        $uid2: { $id: '$uid2', id: '$uid2', name: 'John Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('returns a newly created model', async () => {
    const store = createStore([User])

    const user = await store.dispatch('entities/users/new')

    expect(user).toBeInstanceOf(User)
    expect(user.$id).toBe('$uid1')
    expect(user.id).toBe('$uid1')
    expect(user.name).toBe('John Doe')
  })
})
