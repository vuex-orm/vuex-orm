import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Feature – Hooks – Global Delete', () => {
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

  it('can process `beforeDelete` hook', async () => {
    createStore([{ model: User }])

    let hit = false

    Query.on('beforeDelete', (model, entity) => {
      hit = true
    })

    await User.create({ id: 1, role: 'user' })

    await User.delete(1)

    const results = User.all()

    expect(hit).toBe(true)
    expect(results).toEqual([])
  })

  it('can cancel the mutation by returning false from `beforeDelete` hook', async () => {
    createStore([{ model: User }])

    Query.on('beforeDelete', (model, entity) => {
      return false
    })

    await User.create({ id: 1, role: 'user' })

    await User.delete(1)

    const results = User.all()

    expect(results[0].role).toBe('user')
  })

  it('can process `afterDelete` hook', async () => {
    createStore([{ model: User }])

    let hit = false

    Query.on('afterDelete', (_model, _entity) => {
      hit = true
    })

    await User.create({ id: 1, role: 'user' })

    await User.delete(1)

    expect(hit).toBe(true)
  })
})
