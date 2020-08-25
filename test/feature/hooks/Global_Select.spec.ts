import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'
import Query from '@/query/Query'

describe('Feature – Hooks – Global Select', () => {
  class User extends Model {
    static entity = 'users'

    // @Attribute
    id!: number

    // @Attribute('')
    role!: string

    static fields() {
      return {
        id: this.attr(null),
        role: this.attr('')
      }
    }
  }

  beforeEach(() => {
    createStore([{ model: User }])

    Query.hooks = {}
    Query.lastHookId = 0
  })

  it('can process afterWhere hook', async () => {
    await User.create({
      data: [
        { id: 1, role: 'admin' },
        { id: 2, role: 'admin' },
        { id: 3, role: 'user' }
      ]
    })

    const expected = [{ $id: '1', id: 1, role: 'admin' }]

    const hookId = Query.on('afterWhere', function (
      records: any,
      _entity: any
    ) {
      expect(records.length).toBe(2)

      return records.filter((record: User) => record.id === 1)
    })

    const users = User.query().where('role', 'admin').get()
    expect(users).toEqual(expected)

    const removeBoolean = Query.off(hookId)
    expect(removeBoolean).toBe(true)
  })
})
