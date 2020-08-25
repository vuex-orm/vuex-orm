import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Retrieve – Order By', () => {
  class User extends Model {
    static entity = 'users'

    // @Attribute
    id!: number

    // @Attribute('')
    name!: string

    static fields() {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  it('can sort by model fields in asc order', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Andy' },
        { id: 3, name: 'Roger' },
        { id: 10, name: 'Andy' }
      ]
    })

    const expected = [
      { $id: '1', id: 1, name: 'John' },
      { $id: '2', id: 2, name: 'Andy' },
      { $id: '3', id: 3, name: 'Roger' },
      { $id: '10', id: 10, name: 'Andy' }
    ]

    const result1 = store.getters['entities/users/query']().orderBy('id').get()
    expect(result1).toEqual(expected)

    const result2 = store.getters['entities/users/query']()
      .orderBy('id', 'asc')
      .get()
    expect(result2).toEqual(expected)
  })

  it('can sort by model fields in desc order', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Andy' },
        { id: 3, name: 'Roger' },
        { id: 10, name: 'Andy' }
      ]
    })

    const expected = [
      { $id: '10', id: 10, name: 'Andy' },
      { $id: '2', id: 2, name: 'Andy' },
      { $id: '1', id: 1, name: 'John' },
      { $id: '3', id: 3, name: 'Roger' }
    ]

    const result = store.getters['entities/users/query']()
      .orderBy('name')
      .orderBy('id', 'desc')
      .get()

    expect(result).toEqual(expected)
  })

  it('can sort using a function ', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Andy' },
        { id: 3, name: 'Roger' }
      ]
    })

    const expected = [
      { $id: '2', id: 2, name: 'Andy' },
      { $id: '3', id: 3, name: 'Roger' },
      { $id: '1', id: 1, name: 'John' }
    ]

    const result = store.getters['entities/users/query']()
      .orderBy((user: User) => user.name[2]) // Sort by third character in name.
      .get()

    expect(result).toEqual(expected)
  })

  it('can sort using a function in desc order', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Andy' }
      ]
    })

    const expected = [
      { $id: '2', id: 2, name: 'Andy' },
      { $id: '1', id: 1, name: 'John' }
    ]

    const result = store.getters['entities/users/query']()
      .orderBy((user: User) => user.id, 'desc')
      .get()

    expect(result).toEqual(expected)
  })

  it('can sort by model fields with first method', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Andy' },
        { id: 3, name: 'Roger' }
      ]
    })

    const expected = { $id: '2', id: 2, name: 'Andy' }

    const result = store.getters['entities/users/query']()
      .orderBy('name')
      .orderBy('id', 'desc')
      .first()

    expect(result).toEqual(expected)
  })
})
