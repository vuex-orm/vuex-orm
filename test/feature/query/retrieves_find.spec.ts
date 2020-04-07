import {
  createStore,
  fillState
} from 'test/Helpers'
import { Model, Attr, Str } from '@/index'

describe('feature/query/retrieves_find', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('can find a record by id', () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    const user = store.$repo(User).find(2)

    const expected = { id: 2, name: 'Jane Doe' }

    expect(user).toBeInstanceOf(User)
    expect(user).toEqual(expected)
  })

  it('returns `null` if the reocrd is not found', () => {
    const store = createStore([User])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    const user = store.$repo(User).find(4)

    expect(user).toBe(null)
  })
})
