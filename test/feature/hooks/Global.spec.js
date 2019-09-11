import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Feature – Hooks – Global', () => {
  beforeEach(() => {
    Query.hooks = {}
    Query.lastHookId = 0
  })

  it('can get instance context in hook', () => {
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

    store.dispatch('entities/users/create', {
      data: [{ id: 1, role: 'admin' }, { id: 2, role: 'admin' }, { id: 3, role: 'user' }]
    })

    const expected = [
      { $id: 1, id: 1, role: 'admin' }
    ]

    const callbackFunction = function (records) {
      expect(records.length).toBe(2)
      expect(this).toBeInstanceOf(Query)

      return records.filter(r => r.id === 1)
    }

    const hookId = Query.on('afterWhere', callbackFunction)

    const result = store.getters['entities/users/query']().where('role', 'admin').get()

    expect(result).toEqual(expected)

    const removeBoolean = Query.off(hookId)

    expect(removeBoolean).toBe(true)
  })

  it('can remove callback hooks once and through off method', () => {
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

    store.dispatch('entities/users/create', {
      data: [{ id: 1, role: 'admin' }, { id: 2, role: 'admin' }, { id: 3, role: 'user' }]
    })

    const callbackFunction = function (records) {
      return records
    }

    const persistedHookId1 = Query.on('afterWhere', callbackFunction)
    expect(Query.hooks.afterWhere.length).toBe(1)
    store.getters['entities/users/all']()
    expect(Query.hooks.afterWhere.length).toBe(1)

    const persistedHookId2 = Query.on('beforeSelect', callbackFunction)
    expect(Query.hooks.beforeSelect.length).toBe(1)

    store.getters['entities/users/all']()
    expect(Query.hooks.beforeSelect.length).toBe(1)

    Query.on('beforeSelect', callbackFunction, true)
    Query.on('beforeSelect', callbackFunction, true)
    Query.on('beforeSelect', callbackFunction, true)
    expect(Query.hooks.beforeSelect.length).toBe(4)

    store.getters['entities/users/all']()
    expect(Query.hooks.beforeSelect.length).toBe(1)

    const removed1 = Query.off(persistedHookId1)
    expect(removed1).toBe(true)
    expect(Query.hooks.afterWhere.length).toBe(0)

    const removed2 = Query.off(persistedHookId2)
    expect(removed2).toBe(true)
    expect(Query.hooks.beforeSelect.length).toBe(0)
  })

  it('can process hook only once', () => {
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

    Query.on('beforeCreate', (model, entity) => {
      model.role = 'admin'
    }, true)

    User.create({
      data: [{ id: 1, role: 'user' }, { id: 2, role: 'guest' }]
    })

    const results1 = User.all()

    expect(results1[0].role).toBe('admin')
    expect(results1[1].role).toBe('guest')
  })
})
