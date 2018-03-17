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

  it('can process afterWhere hook', () => {

    const state = {
      name: 'entities',
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

    Query.on('afterWhere', function(records, entity) {
      expect(records.length).toBe(2)
      return records.filter(r => r.id === 1)
    })

    const result = Query.query(state, 'users', false)
      .where('role', 'admin')
      .where('sex', 'male')
      .where('enabled', true)
      .get()

    expect(result).toEqual(expected)
    Query.hooks = []

  })

  it('can get instance context in hook', () => {

    const state = {
      name: 'entities',
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

    Query.on('afterWhere', callbackFunction)

    const result = Query.query(state, 'users', false)
      .where('role', 'admin')
      .where('sex', 'male')
      .where('enabled', true)
      .get()

    expect(result).toEqual(expected)
    Query.hooks = []

  })

  it('can contains correct instance context in hook', () => {

    const state = {
      name: 'entities',
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

    Query.prototype.searches = ['term1']

    Query.prototype.search = function (term) {
      expect(this).toBeInstanceOf(Query)
      expect(this.searches.length).toBe(1)
      this.searches.push(term)
      return this
    }

    const callbackFunction = function (records) {
      expect(records.length).toBe(2)
      expect(this.searches.length).toBe(2)
      expect(this).toBeInstanceOf(Query)
      return records.filter(r => r.id === 1)
    }

    Query.on('afterWhere', callbackFunction)

    const result = Query.query(state, 'users', false)
      .where('role', 'admin')
      .where('sex', 'male')
      .where('enabled', true)
      .search('term2')
      .get()

    expect(result).toEqual(expected)
    Query.hooks = []
    Query.searches = []

  })

})
