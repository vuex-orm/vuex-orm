import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Feature – Hooks – Global Create', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        role: this.attr('')
      }
    }
  }

  beforeEach(() => {
    Query.hooks = {}
    Query.lastHookId = 0
  })

  it('can process `beforeCreate` hook', async () => {
    createStore([{ model: User }])

    Query.on('beforeCreate', (model, entity) => {
      model.role = 'admin'
    })

    await User.create({
      data: [{ id: 1, role: 'admin' }, { id: 2, role: 'user' }]
    })

    const results = User.all()

    expect(results[0].role).toBe('admin')
    expect(results[1].role).toBe('admin')
  })

  it('can process multiple `beforeCreate` hook', async () => {
    createStore([{ model: User }])

    Query.on('beforeCreate', (model, entity) => { model.role = 'admin' })
    Query.on('beforeCreate', (model, entity) => { model.role = 'not admin' })

    await User.create({
      data: [{ id: 1, role: 'admin' }, { id: 2, role: 'user' }]
    })

    const results = User.all()

    expect(results[0].role).toBe('not admin')
    expect(results[1].role).toBe('not admin')
  })

  it('can cancel the mutation by returning false from `beforeCreate` hook', async () => {
    createStore([{ model: User }])

    Query.on('beforeCreate', (model, entity) => {
      if (model.role === 'admin') {
        return false
      }
    })

    await User.create({
      data: [{ id: 1, role: 'admin' }, { id: 2, role: 'user' }]
    })

    const results = User.all()

    expect(results.length).toBe(1)
    expect(results[0].role).toBe('user')
  })

  it('can process `afterCreate` hook', async () => {
    createStore([{ model: User }])

    let hit = false

    Query.on('afterCreate', (_model, _entity) => {
      hit = true
    })

    await User.create({
      data: { id: 1, role: 'admin' }
    })

    expect(hit).toBe(true)
  })
})
