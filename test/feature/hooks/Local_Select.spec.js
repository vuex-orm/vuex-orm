import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Hooks – Local Select', () => {
  it('can process beforeSelect hook', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          role: this.attr('')
        }
      }

      static beforeSelect (records) {
        return records.filter(record => record.role === 'admin')
      }
    }

    createStore([{ model: User }])

    await User.create([
      { id: 1, role: 'admin' },
      { id: 2, role: 'admin' },
      { id: 3, role: 'user' }
    ])

    const results = User.query().get()

    expect(results.length).toBe(2)
    expect(results[0].role).toBe('admin')
    expect(results[1].role).toBe('admin')
  })
})
