import { createStore, fillState, assertState } from 'test/Helpers'
import { Model, Attr, Str, Num } from '@/index'

describe('feature/repository/updates_update_query', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
    @Num(0) age!: number
  }

  it('updates a record specified by the query chain', async () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 }
      }
    })

    await store
      .$repo(User)
      .where('name', 'Jane Doe')
      .update({ age: 50 })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 50 },
        3: { id: 3, name: 'Johnny Doe', age: 20 }
      }
    })
  })

  it('updates multiple records specified by the query chain', async () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 }
      }
    })

    await store
      .$repo(User)
      .where('name', 'Jane Doe')
      .orWhere('age', 20)
      .update({ age: 50 })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 50 },
        3: { id: 3, name: 'Johnny Doe', age: 50 }
      }
    })
  })
})
