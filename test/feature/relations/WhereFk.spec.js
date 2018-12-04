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

  it('can handle previously filled _joinedIdFilter', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: []
    })

    const query = store.getters['entities/users/query']()
    query.whereFk('id', [1])
    query.whereFk('id', [1, 2])
    const expected = [1]

    expect(Array.from(query._joinedIdFilter.values())).toEqual(expected)
  })
})
