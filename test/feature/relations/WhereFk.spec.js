import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Retrieve – Where', () => {
  class User extends Model {
    static entity = 'users'

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

    await User.create([])

    const query = User.query()

    query.whereFk('id', [1])
    query.whereFk('id', [1, 2])

    const expected = [1]

    expect(Array.from(query.joinedIdFilter.values())).toEqual(expected)
  })
})
