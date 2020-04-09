import {
  createStore,
  fillState,
  assertInstanceOf,
  assertModels
} from 'test/Helpers'
import { Model, Attr, Str, Num } from '@/index'

describe('feature/repository/retrieves_where', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
    @Num(0) age!: number
  }

  it('can filter the query by the `where` clause', () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 }
      }
    })

    const users = store.$repo(User).where('age', 30).get()

    const expected = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 30 }
    ]

    expect(users.length).toBe(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can chain multiple `where` clause', () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 }
      }
    })

    const users = store
      .$repo(User)
      .where('name', 'John Doe')
      .where('age', 30)
      .get()

    const expected = [{ id: 1, name: 'John Doe', age: 30 }]

    expect(users.length).toBe(1)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })
})
