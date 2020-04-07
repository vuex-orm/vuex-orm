import {
  createStore,
  fillState,
  assertInstanceOf,
  assertModels
} from 'test/Helpers'
import { Model, Attr, Str, Num } from '@/index'

describe('feature/query/retrieves_where', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
    @Num(0) age!: number
  }

  it('can filter query by `or where` clause', () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 }
      }
    })

    const users = store
      .$repo(User)
      .where('name', 'John Doe')
      .orWhere('age', 30)
      .get()

    const expected = [
      { id: 1, name: 'John Doe', age: 40 },
      { id: 2, name: 'Jane Doe', age: 30 }
    ]

    expect(users.length).toBe(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('the "or where" clause can be used alone', () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 }
      }
    })

    const users = store
      .$repo(User)
      .orWhere('age', 30)
      .get()

    const expected = [{ id: 2, name: 'Jane Doe', age: 30 }]

    expect(users.length).toBe(1)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })
})
