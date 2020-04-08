import { createStore, assertState } from 'test/Helpers'
import { Model, Attr, Str, HasOne } from '@/index'

describe('feature/relations/has_one_insert', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string

    @HasOne(() => Phone, 'userId')
    phone!: Phone | null
  }

  class Phone extends Model {
    static entity = 'phones'

    @Attr() id!: number
    @Attr() userId!: number
    @Str('') number!: string
  }

  it('inserts a record to the store with "has one" relation', async () => {
    const store = createStore([User, Phone])

    await store.$repo(User).insert({
      id: 1,
      name: 'John Doe',
      phone: {
        id: 1,
        number: '123-4567-8912'
      }
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      phones: {
        1: { id: 1, number: '123-4567-8912' }
      }
    })
  })
})
