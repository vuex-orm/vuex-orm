import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Feature – Hooks – Global', () => {
  beforeEach(() => {
    Query.hooks = {}
    Query.lastHookId = 0
  })

  it('can get instance context in hook', async () => {
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

    const callbackFunction = function (this: Query, records: any) {
      expect(records.length).toBe(2)
      expect(this).toBeInstanceOf(Query)

      return records.filter((r: any) => r.id === 1)
    }

    const hookId = Query.on('afterWhere', callbackFunction)

    const result = User.query().where('role', 'admin').get()

    expect(result).toEqual(expected)

    const removeBoolean = Query.off(hookId)

    expect(removeBoolean).toBe(true)
  })

  it('can remove callback hooks through off method', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          role: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [{ id: 1, role: 'admin' }, { id: 2, role: 'admin' }, { id: 3, role: 'user' }]
    })

    const callbackFunction = function (records: any) {
      return records
    }

    const persistedHookId1 = Query.on('afterWhere', callbackFunction)

    expect(Query.hooks.afterWhere.length).toBe(1)

    User.all()

    expect(Query.hooks.afterWhere.length).toBe(1)

    const persistedHookId2 = Query.on('beforeSelect', callbackFunction)

    expect(Query.hooks.beforeSelect.length).toBe(1)

    User.all()

    expect(Query.hooks.beforeSelect.length).toBe(1)

    const removed1 = Query.off(persistedHookId1)

    expect(removed1).toBe(true)
    expect(Query.hooks.afterWhere.length).toBe(0)

    const removed2 = Query.off(persistedHookId2)

    expect(removed2).toBe(true)
    expect(Query.hooks.beforeSelect.length).toBe(0)
  })
})
