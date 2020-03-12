import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Retrieve – Where', () => {
  class User extends Model {
    static entity = 'users'

    // @Attribute
    id!: number

    // @Attribute('')
    name!: string

    // @Attribute
    age!: number

    // @Attribute(false)
    active!: boolean

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr(''),
        age: this.attr(null),
        active: this.attr(false)
      }
    }

    isActive () {
      return this.active
    }
  }

  it('can handle previously filled _joinedIdFilter', async () => {
    createStore([{ model: User }])

    await User.create({ data: [] })

    const query = User.query()

    query.whereFk('id', [1])
    query.whereFk('id', [1, 2])

    const keys = Array.from((query as any).joinedIdFilter.values())

    expect(keys).toEqual([1])
  })
})
