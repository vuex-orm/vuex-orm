import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Hooks – Local Select', () => {
  it('can process beforeSelect hook', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @Attribute('')
      role!: string

      static fields () {
        return {
          id: this.attr(null),
          role: this.attr('')
        }
      }

      static beforeSelect (records: any) {
        return records.filter((record: User) => record.role === 'admin')
      }
    }

    createStore([{ model: User }])

    await User.create({
      data: [
        { id: 1, role: 'admin' },
        { id: 2, role: 'admin' },
        { id: 3, role: 'user' }
      ]
    })

    const users = User.query().get()

    expect(users.length).toBe(2)
    expect(users[0].role).toBe('admin')
    expect(users[1].role).toBe('admin')
  })
})
