import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'
import Query from '@/query/Query'

describe('Feature – Hooks – Global Delete', () => {
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

  it('can process `beforeDelete` hook', async () => {
    let hit = false

    Query.on('beforeDelete', (_model: any, _entity: any) => {
      hit = true
    })

    await User.create({
      data: { id: 1, role: 'user' }
    })

    await User.delete(1)

    const users = User.all()

    expect(hit).toBe(true)
    expect(users).toEqual([])
  })

  it('can cancel the mutation by returning false from `beforeDelete` hook', async () => {
    Query.on('beforeDelete', (_model: any, _entity: any): any => {
      return false
    })

    await User.create({
      data: { id: 1, role: 'user' }
    })

    await User.delete(1)

    const user = User.find(1)

    expect(user?.role).toBe('user')
  })

  it('can process `afterDelete` hook', async () => {
    let hit = false

    Query.on('afterDelete', (_model: any, _entity: any) => {
      hit = true
    })

    await User.create({
      data: { id: 1, role: 'user' }
    })

    await User.delete(1)

    expect(hit).toBe(true)
  })
})
