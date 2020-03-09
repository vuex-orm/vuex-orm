import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Feature – Hooks – Global Update', () => {
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

  it('can process `beforeUpdate` hook', async () => {
    createStore([{ model: User }])

    Query.on('beforeUpdate', (model, entity) => {
      model.role = 'admin'
    })

    await User.create({ id: 1, role: 'user' })

    await User.update({ id: 1, role: 'guest' })

    const results = User.all()

    expect(results[0].role).toBe('admin')
  })

  it('can cancel the mutation by returning false from `beforeUpdate` hook', async () => {
    createStore([{ model: User }])

    Query.on('beforeUpdate', (model, entity) => {
      if (model.role === 'admin') {
        return false
      }
    })

    await User.create({ id: 1, role: 'user' })

    await User.update({ id: 1, role: 'admin' })

    const results = User.all()

    expect(results[0].role).toBe('user')
  })

  it('can process `afterUpdate` hook', async () => {
    createStore([{ model: User }])

    let hit = false

    Query.on('afterUpdate', (_model, _entity) => {
      hit = true
    })

    await User.create({ id: 1, role: 'user' })

    await User.update({ id: 1, role: 'admin' })

    expect(hit).toBe(true)
  })
})
