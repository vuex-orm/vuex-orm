import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'
import Hook from 'app/query/Hook'

describe('Feature – Hooks – Global', () => {
  afterEach(() => {
    Hook.hooks = {}
    Hook.lastHookId = 0
  })

  it('can process afterWhere hook', () => {
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

    const hookId = Query.on('afterWhere', function (records, entity) {
      expect(records.length).toBe(2)

      return records.filter(r => r.id === 1)
    })

    const result = store.getters['entities/users/query']().where('role', 'admin').get()

    expect(result).toEqual(expected)

    const removeBoolean = Query.off(hookId)

    expect(removeBoolean).toBe(true)
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

    const persistedHookId__1 = Query.on('afterWhere', callbackFunction)
    expect(Hook.hooks.afterWhere.length).toBe(1)
    store.getters['entities/users/all']()
    expect(Hook.hooks.afterWhere.length).toBe(1)

    const persistedHookId__2 = Query.on('beforeSelect', callbackFunction)
    expect(Hook.hooks.beforeSelect.length).toBe(1)

    store.getters['entities/users/all']()
    expect(Hook.hooks.beforeSelect.length).toBe(1)

    Query.on('beforeSelect', callbackFunction, true)
    Query.on('beforeSelect', callbackFunction, true)
    Query.on('beforeSelect', callbackFunction, true)
    expect(Hook.hooks.beforeSelect.length).toBe(4)

    store.getters['entities/users/all']()
    expect(Hook.hooks.beforeSelect.length).toBe(1)

    const removed_1 = Query.off(persistedHookId__1)
    expect(removed_1).toBe(true)
    expect(Hook.hooks.afterWhere.length).toBe(0)

    const removed_2 = Query.off(persistedHookId__2)
    expect(removed_2).toBe(true)
    expect(Hook.hooks.beforeSelect.length).toBe(0)
  })
})
