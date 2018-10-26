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

  it('can retrieve records that matches the where clause', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 20, active: false }
      ]
    })

    const expected = [
      { $id: 1, id: 1, name: 'John', age: 20, active: true },
      { $id: 2, id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where('age', 20)
      .where('active', true)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that contains the value in the where clause array', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 24, active: true },
        { id: 3, name: 'Johnny', age: 20, active: false }
      ]
    })

    const expected = [
      { $id: 1, id: 1, name: 'John', age: 20, active: true },
      { $id: 2, id: 2, name: 'Jane', age: 24, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where('age', [20, 24])
      .where('active', true)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches in the where clause value as a closure', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true }
      ]
    })

    const expected = [
      { $id: 1, id: 1, name: 'John', age: 20, active: true },
      { $id: 2, id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where('age', v => v === 20)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches in the where clause as a closure', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true }
      ]
    })

    const expected = [
      { $id: 1, id: 1, name: 'John', age: 20, active: true },
      { $id: 2, id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where(user => user.age === 20)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the where query with a function that accesses variables from outside the scope', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true }
      ]
    })

    const expected = [
      { $id: 1, id: 1, name: 'John', age: 20, active: true },
      { $id: 2, id: 2, name: 'Jane', age: 20, active: true }
    ]

    const ageAsVariable = 20

    const users = store.getters['entities/users/query']()
      .where(user => user.age === ageAsVariable)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the where query with nested query builder', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true }
      ]
    })

    const expected = [
      { $id: 1, id: 1, name: 'John', age: 20, active: true },
      { $id: 2, id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where((_user, query) => { query.where('age', 20) })
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that match the where query by comparing model instance.', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 24, active: false },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: false }
      ]
    })

    const expected = [
      { $id: 2, id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where((_user, _query, model) => {
        return model.isActive()
      })
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the where query with complex nested query builder', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 24, active: false },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true }
      ]
    })

    const expected = [
      { $id: 1, id: 1, name: 'John', age: 24, active: false },
      { $id: 2, id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where((_user, query) => {
        query.where('age', 20).where('active', true)
      })
      .orWhere('id', 1)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the orWhere query', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true }
      ]
    })

    const expected = [
      { $id: 1, id: 1, name: 'John', age: 20, active: true },
      { $id: 2, id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .where('id', 1)
      .orWhere('id', 2)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records with only the orWhere query', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 20, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true }
      ]
    })

    const expected = [
      { $id: 2, id: 2, name: 'Jane', age: 20, active: true }
    ]

    const users = store.getters['entities/users/query']()
      .orWhere('id', 2)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the where query with 2 nested query builders, starting with orWhere', () => {
    const store = createStore([
      {
        model: User
      }
    ])

    store.dispatch('entities/users/create', {
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
      { $id: 1, id: 1, name: 'John', age: 24, active: false },
      { $id: 2, id: 2, name: 'Jane', age: 20, active: true }
    ]

    // (A && B) || (C && D)
    const users = store.getters['entities/users/query']()
      .where((_user, query) => {
        query.where('age', 20).where('active', true)
      })
      .orWhere((_user, query) => {
        query.where('age', 24).where('active', false)
      })
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the where query with 2 nested query builders, starting with where', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John', age: 21, active: true },
        { id: 2, name: 'Jane', age: 20, active: true },
        { id: 3, name: 'Johnny', age: 24, active: true },
        { id: 4, name: 'James', age: 21, active: false }
      ]
    })

    const expected = [
      { $id: 1, id: 1, name: 'John', age: 21, active: true },
      { $id: 2, id: 2, name: 'Jane', age: 20, active: true }
    ]

    // (A || B) && (C || D)
    const users = store.getters['entities/users/query']()
      .where((_user, query) => {
        query.where('age', 20).orWhere('age', 21)
      })
      .where((_user, query) => {
        query.where('active', true)
      })
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the where query several nested query builders', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
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
      { $id: 1, id: 1, name: 'John', age: 21, active: true },
      { $id: 2, id: 2, name: 'Jane', age: 20, active: true },
      { $id: 5, id: 5, name: 'Jimmy', age: 22, active: true }
    ]

    // (A || B || (E && F)) && (C || D)
    const users = store.getters['entities/users/query']()
      .where((_user, query) => {
        query.where('age', 20).orWhere('age', 21).orWhere((_user2, q) => {
          q.where('age', 22).where(u => { return u.name.indexOf('Jimm') === 0 })
        })
      })
      .where((_user, query) => {
        query.where('active', true)
      })
      .get()

    expect(users).toEqual(expected)
  })
})
