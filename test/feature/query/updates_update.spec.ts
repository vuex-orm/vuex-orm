import { createStore, fillState, assertState } from 'test/Helpers'
import { Model, Attr, Str, Num } from '@/index'

describe('feature/query/updates_update', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
    @Num(0) age!: number
  }

  it('updates record by passing record with primary key', async () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 }
      }
    })

    await store.$repo(User).update({ id: 2, age: 50 })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 50 },
        3: { id: 3, name: 'Johnny Doe', age: 20 }
      }
    })
  })

  it('updates records by passing an array of records with primary key', async () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 }
      }
    })

    await store.$repo(User).update([
      { id: 2, age: 50 },
      { id: 3, age: 60 }
    ])

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 50 },
        3: { id: 3, name: 'Johnny Doe', age: 60 }
      }
    })
  })
})
