import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'
import Query from '@/query/Query'

describe('Feature – Hooks – Global Update', () => {
  class User extends Model {
    static entity = 'users'

    // @Attribute
    id!: number

    // @Attribute('')
    role!: string

    static fields () {
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

  it('can process `beforeUpdate` hook', async () => {
    Query.on('beforeUpdate', (model: any, _entity: any) => {
      model.role = 'admin'
    })

    await User.create({
      data: { id: 1, role: 'user' }
    })

    await User.update({
      data: { id: 1, role: 'guest' }
    })

    const user = User.find(1)

    expect(user?.role).toBe('admin')
  })

  it('can cancel the mutation by returning false from `beforeUpdate` hook', async () => {
    Query.on('beforeUpdate', (model: any, _entity: any): any => {
      if (model.role === 'admin') {
        return false
      }
    })

    await User.create({
      data: { id: 1, role: 'user' }
    })

    await User.update({
      data: { id: 1, role: 'admin' }
    })

    const user = User.find(1)

    expect(user?.role).toBe('user')
  })

  it('can process `afterUpdate` hook', async () => {
    let hit = false

    Query.on('afterUpdate', (_model: any, _entity: any) => {
      hit = true
    })

    await User.create({
      data: { id: 1, role: 'user' }
    })

    await User.update({
      data: { id: 1, role: 'admin' }
    })

    expect(hit).toBe(true)
  })
})
