import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Feature – Aggregates', () => {
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
    createStore([{ model: User }])
  })

  it('can get count of the data', async () => {
    await User.create({
      data: [
        { id: 1, role: 'admin' },
        { id: 2, role: 'user' },
        { id: 3, role: 'admin' }
      ]
    })

    expect(User.query().count()).toBe(3)
    expect(User.query().where('role', 'admin').count()).toBe(2)
  })

  it('can get max value of the specified field', async () => {
    await User.create({
      data: [
        { id: 8, role: 'admin' },
        { id: 12, role: 'user' },
        { id: 11, role: 'admin' },
        { id: 'A', role: 'admin' }
      ]
    })

    expect(User.query().max('id')).toBe(12)
    expect(User.query().max('role')).toBe(0)
    expect(User.query().where('role', 'admin').max('id')).toBe(11)
  })

  it('can get min value of the specified field', async () => {
    await User.create({
      data: [
        { id: 8, role: 'admin' },
        { id: 12, role: 'user' },
        { id: 11, role: 'admin' },
        { id: 'A', role: 'admin' }
      ]
    })

    expect(User.query().min('id')).toBe(8)
    expect(User.query().min('role')).toBe(0)
    expect(User.query().where('role', 'admin').min('id')).toBe(8)
  })

  it('can get sum value of the specified field', async () => {
    await User.create({
      data: [
        { id: 8, role: 'admin' },
        { id: 12, role: 'user' },
        { id: 11, role: 'admin' },
        { id: 'A', role: 'admin' }
      ]
    })

    expect(User.query().sum('id')).toBe(31)
    expect(User.query().where('role', 'admin').sum('id')).toBe(19)
  })
})
