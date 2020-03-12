import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'
import Query from '@/query/Query'

describe('Feature – Retrieve – Where', () => {
  class User extends Model {
    static entity = 'users'

    // @Attribute
    id!: boolean

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

  it('can retrieve records that matches the where clause', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 20, active: false }
      ]
    })

    const expected = [
      { $id: '1', id: 1, name: 'John', age: 20, active: true },
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where('age', 20)
      .where('active', true)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the whereId clause', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 20, active: false }
      ]
    })

    const expected = [
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .whereId(2)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the whereId clause using intersection ("and" boolean)', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 20, active: false }
      ]
    })

    const users = store.getters['entities/users/query']()
      .whereId(2)
      .whereId(1)
      .get()

    expect(users).toEqual([])
  })

  it('can retrieve records that matches the whereId and orWhere', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 20, active: false }
      ]
    })

    const expected = [
      { $id: '1', id: 1, name: 'John', age: 20, active: true },
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .whereId(2)
      .orWhere('id', 1)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the whereIdIn clause', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 20, active: false }
      ]
    })

    const expected = [
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true },
      { $id: '3', id: 3, name: 'Johnny', age: 20, active: false }
    ]

    const users = store.getters['entities/users/query']()
      .whereIdIn([2, 3])
      .all()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the whereIdIn clause using intersection ("and" boolean)', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 20, active: false }
      ]
    })

    const expected = [
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .whereIdIn([2, 3])
      .whereIdIn([1, 2])
      .all()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the whereIdIn and orWhere', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 20, active: false }
      ]
    })

    const expected = [
      { $id: '1', id: 1, name: 'John', age: 20, active: true },
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true },
      { $id: '3', id: 3, name: 'Johnny', age: 20, active: false }
    ]

    const users = store.getters['entities/users/query']()
      .whereIdIn([2, 3])
      .orWhere('id', 1)
      .all()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that contains the value in the where clause array', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 24, active: true },
        { id: 3, name: 'Johnny', age: 20, active: false }
      ]
    })

    const expected = [
      { $id: '1', id: 1, name: 'John', age: 20, active: true },
      { $id: '2', id: 2, name: 'Jane', age: 24, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where('age', [20, 24])
      .where('active', true)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches in the where clause value as a closure', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true }
      ]
    })

    const expected = [
      { $id: '1', id: 1, name: 'John', age: 20, active: true },
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where('age', (value: number) => value === 20)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches in the where clause as a closure', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true }
      ]
    })

    const expected = [
      { $id: '1', id: 1, name: 'John', age: 20, active: true },
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where((user: User) => user.age === 20)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the where query with a function that accesses variables from outside the scope', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true }
      ]
    })

    const expected = [
      { $id: '1', id: 1, name: 'John', age: 20, active: true },
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true }
    ]

    const ageAsVariable = 20

    const users = store.getters['entities/users/query']()
      .where((user: User) => user.age === ageAsVariable)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the where query with nested query builder', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true }
      ]
    })

    const expected = [
      { $id: '1', id: 1, name: 'John', age: 20, active: true },
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where((_user: User, query: Query) => { query.where('age', 20) })
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that match the where query by comparing model instance.', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 24, active: false },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: false }
      ]
    })

    const expected = [
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where((_user: User, _query: Query, model: User) => {
        return model.isActive()
      })
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the where query with complex nested query builder', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 24, active: false },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true }
      ]
    })

    const expected = [
      { $id: '1', id: 1, name: 'John', age: 24, active: false },
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where((_user: User, query: Query) => {
        query.where('age', 20).where('active', true)
      })
      .orWhere('id', 1)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the orWhere query', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true }
      ]
    })

    const expected = [
      { $id: '1', id: 1, name: 'John', age: 20, active: true },
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where('id', 1)
      .orWhere('id', 2)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records with only the orWhere query', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true }
      ]
    })

    const expected = [
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .orWhere('id', 2)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the where query with 2 nested query builders, starting with orWhere', async () => {
    const store = createStore([
      {
        model: User
      }
    ])

    await store.dispatch('entities/users/create', {
      data: [
        {
          id: 1,
          name: 'John',
          age: 24,
          active: false
        },
        {
          id: 2,
          name: 'Jane',
          age: 20,
          active: true
        },
        {
          id: 3,
          name: 'Johnny',
          age: 24,
          active: true
        }
      ]
    })

    const expected = [
      { $id: '1', id: 1, name: 'John', age: 24, active: false },
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true }
    ]

    // (A && B) || (C && D)
    const users = store.getters['entities/users/query']()
      .where((_user: User, query: Query) => {
        query.where('age', 20).where('active', true)
      })
      .orWhere((_user: User, query: Query) => {
        query.where('age', 24).where('active', false)
      })
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the where query with 2 nested query builders, starting with where', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 21, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true },
        { id: 4, name: 'James', age: 21, active: false }
      ]
    })

    const expected = [
      { $id: '1', id: 1, name: 'John', age: 21, active: true },
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true }
    ]

    // (A || B) && (C || D)
    const users = store.getters['entities/users/query']()
      .where((_user: User, query: Query) => {
        query.where('age', 20).orWhere('age', 21)
      })
      .where((_user: User, query: Query) => {
        query.where('active', true)
      })
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the where query several nested query builders', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 21, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true },
        { id: 4, name: 'James', age: 21, active: false },
        { id: 5, name: 'Jimmy', age: 22, active: true },
        { id: 6, name: 'Jim', age: 22, active: true },
        { id: 7, name: 'Jules', age: 22, active: false }
      ]
    })

    const expected = [
      { $id: '1', id: 1, name: 'John', age: 21, active: true },
      { $id: '2', id: 2, name: 'Jane', age: 20, active: true },
      { $id: '5', id: 5, name: 'Jimmy', age: 22, active: true }
    ]

    // (A || B || (E && F)) && (C || D)
    const users = store.getters['entities/users/query']()
      .where((_user: User, query: Query) => {
        query.where('age', 20).orWhere('age', 21).orWhere((_user2: User, q: Query) => {
          q.where('age', 22).where((u: User) => u.name.indexOf('Jimm') === 0)
        })
      })
      .where((_user: User, query: Query) => {
        query.where('active', true)
      })
      .get()

    expect(users).toEqual(expected)
  })
})
