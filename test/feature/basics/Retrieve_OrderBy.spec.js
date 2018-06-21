import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Retrieve – Order By', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  it('can sort by model fields in asc order', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Andy' },
        { id: 3, name: 'Roger' },
        { id: 4, name: 'Andy' }
      ]
    })

    const expected = [
      { $id: 1, id: 1, name: 'John' },
      { $id: 2, id: 2, name: 'Andy' },
      { $id: 3, id: 3, name: 'Roger' },
      { $id: 4, id: 4, name: 'Andy' }
    ]

    const result1 = store.getters['entities/users/query']().orderBy('id').get()

    expect(result1).toEqual(expected)

    const result2 = store.getters['entities/users/query']().orderBy('id', 'asc').get()

    expect(result2).toEqual(expected)
  })

  it('can sort by model fields in desc order', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Andy' },
        { id: 3, name: 'Roger' },
        { id: 4, name: 'Andy' }
      ]
    })

    const expected = [
      { $id: 4, id: 4, name: 'Andy' },
      { $id: 2, id: 2, name: 'Andy' },
      { $id: 1, id: 1, name: 'John' },
      { $id: 3, id: 3, name: 'Roger' }
    ]

    const result = store.getters['entities/users/query']()
      .orderBy('name')
      .orderBy('id', 'desc')
      .get()

    expect(result).toEqual(expected)
  })

  it('can sort by model fields with first method', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Andy' },
        { id: 3, name: 'Roger' }
      ]
    })

    const expected = { $id: 2, id: 2, name: 'Andy' }

    const result = store.getters['entities/users/query']()
      .orderBy('name')
      .orderBy('id', 'desc')
      .first()

    expect(result).toEqual(expected)
  })
})
