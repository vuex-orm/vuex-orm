import { createApplication } from 'test/support/Helpers'
import User from 'test/fixtures/models/User'
import Profile from 'test/fixtures/models/Profile'
import Account from 'test/fixtures/models/Account'
import Post from 'test/fixtures/models/Post'
import Comment from 'test/fixtures/models/Comment'
import Review from 'test/fixtures/models/Review'
import Like from 'test/fixtures/models/Like'
import Cluster from 'test/fixtures/models/Cluster'
import Node from 'test/fixtures/models/Node'
import CustomKey from 'test/fixtures/models/CustomKey'
import Query from 'app/query/Query'
import Hook from 'app/query/Hook'

describe('Query – Hooks', () => {
  beforeEach(() => {
    createApplication('entities', [
      { model: User },
      { model: Profile },
      { model: Account },
      { model: Post },
      { model: Comment },
      { model: Review },
      { model: Like },
      { model: Cluster },
      { model: Node },
      { model: CustomKey }
    ])
  })

  afterEach(() => {
    Hook.hooks = {}
    Hook.lastHookId = 0
  })

  it('can process afterWhere hook', () => {
    const state = {
      $name: 'entities',
      users: { data: {
          '1': { id: 1, role: 'admin', sex: 'male', enabled: true },
          '2': { id: 2, role: 'user', sex: 'female', enabled: true },
          '3': { id: 3, role: 'admin', sex: 'male', enabled: true },
          '4': { id: 4, role: 'admin', sex: 'male', enabled: false }
        }}
    }

    const expected = [
      { id: 1, role: 'admin', sex: 'male', enabled: true }
    ]

    const hookId = Query.on('afterWhere', function (records, entity) {
      expect(records.length).toBe(2)

      return records.filter(r => r.id === 1)
    })

    const result = Query.query(state, 'users', false)
      .where('role', 'admin')
      .where('sex', 'male')
      .where('enabled', true)
      .get()

    expect(result).toEqual(expected)

    const removeBoolean = Query.off(hookId)

    expect(removeBoolean).toBe(true)
  })

  it('can get instance context in hook', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { id: 1, role: 'admin', sex: 'male', enabled: true },
        '2': { id: 2, role: 'user', sex: 'female', enabled: true },
        '3': { id: 3, role: 'admin', sex: 'male', enabled: true },
        '4': { id: 4, role: 'admin', sex: 'male', enabled: false }
      }}
    }

    const expected = [
      { id: 1, role: 'admin', sex: 'male', enabled: true }
    ]

    const callbackFunction = function (records) {
      expect(records.length).toBe(2)
      expect(this).toBeInstanceOf(Query)

      return records.filter(r => r.id === 1)
    }

    const hookId = Query.on('afterWhere', callbackFunction)

    const result = Query.query(state, 'users', false)
      .where('role', 'admin')
      .where('sex', 'male')
      .where('enabled', true)
      .get()

    expect(result).toEqual(expected)

    const removeBoolean = Query.off(hookId)

    expect(removeBoolean).toBe(true)
  })

  it('can remove callback hooks once and through off method', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { id: 1, role: 'admin', sex: 'male', enabled: true },
        '2': { id: 2, role: 'user', sex: 'female', enabled: true },
        '3': { id: 3, role: 'admin', sex: 'male', enabled: true },
        '4': { id: 4, role: 'admin', sex: 'male', enabled: false }
      }}
    }

    const callbackFunction = function (records) {
      return records
    }

    const persistedHookId__1 = Query.on('afterWhere', callbackFunction)
    expect(Hook.hooks.afterWhere.length).toBe(1)
    Query.query(state, 'users', false).all()
    expect(Hook.hooks.afterWhere.length).toBe(1)

    const persistedHookId__2 = Query.on('beforeProcess', callbackFunction)
    expect(Hook.hooks.beforeProcess.length).toBe(1)

    Query.query(state, 'users', false).all()
    expect(Hook.hooks.beforeProcess.length).toBe(1)

    Query.on('beforeProcess', callbackFunction, true)
    Query.on('beforeProcess', callbackFunction, true)
    Query.on('beforeProcess', callbackFunction, true)
    expect(Hook.hooks.beforeProcess.length).toBe(4)

    Query.query(state, 'users', false).all()
    expect(Hook.hooks.beforeProcess.length).toBe(1)

    const removed_1 = Query.off(persistedHookId__1)
    expect(removed_1).toBe(true)
    expect(Hook.hooks.afterWhere.length).toBe(0)

    const removed_2 = Query.off(persistedHookId__2)
    expect(removed_2).toBe(true)
    expect(Hook.hooks.beforeProcess.length).toBe(0)
  })
})
