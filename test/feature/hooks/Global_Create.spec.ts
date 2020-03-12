import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'
import Query from '@/query/Query'

describe('Feature – Hooks – Global Create', () => {
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

  it('can process `beforeCreate` hook', async () => {
    Query.on('beforeCreate', (model: any) => {
      model.role = 'admin'
    })

    await User.create([{ id: 1, role: 'admin' }, { id: 2, role: 'user' }])

    const users = User.all()

    expect(users[0].role).toBe('admin')
    expect(users[1].role).toBe('admin')
  })

  it('can process multiple `beforeCreate` hook', async () => {
    Query.on('beforeCreate', (model: any, _entity: any) => { model.role = 'admin' })
    Query.on('beforeCreate', (model: any, _entity: any) => { model.role = 'not admin' })

    await User.create([{ id: 1, role: 'admin' }, { id: 2, role: 'user' }])

    const users = User.all()

    expect(users[0].role).toBe('not admin')
    expect(users[1].role).toBe('not admin')
  })

  it('can cancel the mutation by returning false from `beforeCreate` hook', async () => {
    Query.on('beforeCreate', (model: any, _entity: any): any => {
      if (model.role === 'admin') {
        return false
      }
    })

    await User.create([{ id: 1, role: 'admin' }, { id: 2, role: 'user' }])

    const users = User.all()

    expect(users.length).toBe(1)
    expect(users[0].role).toBe('user')
  })

  it('can process `afterCreate` hook', async () => {
    let hit = false

    Query.on('afterCreate', (_model: any, _entity: any) => {
      hit = true
    })

    await User.create({ id: 1, role: 'admin' })

    expect(hit).toBe(true)
  })
})
