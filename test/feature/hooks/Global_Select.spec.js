import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Feature – Hooks – Global Select', () => {
  beforeEach(() => {
    Query.hooks = {}
    Query.lastHookId = 0
  })

  it('can process afterWhere hook', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          role: this.attr('')
        }
      }
    }

    createStore([{ model: User }])

    await User.create([
      { id: 1, role: 'admin' },
      { id: 2, role: 'admin' },
      { id: 3, role: 'user' }
    ])

    const expected = [
      { $id: '1', id: 1, role: 'admin' }
    ]

    const hookId = Query.on('afterWhere', function (records, entity) {
      expect(records.length).toBe(2)

      return records.filter(r => r.id === 1)
    })

    const result = User.query().where('role', 'admin').get()

    expect(result).toEqual(expected)

    const removeBoolean = Query.off(hookId)

    expect(removeBoolean).toBe(true)
  })
})
