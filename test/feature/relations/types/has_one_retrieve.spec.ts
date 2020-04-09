import { createStore, fillState, assertModel } from 'test/Helpers'
import { Model, Attr, Str, HasOne } from '@/index'

describe('feature/relations/types/has_one_retrieve', () => {
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

  it('can eager load has one relation', async () => {
    const store = createStore([User, Phone])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      phones: {
        1: { id: 1, userId: 1, number: '123-4567-8912' }
      }
    })

    const user = store.$repo(User).with('phone').first()!

    expect(user).toBeInstanceOf(User)
    expect(user.phone).toBeInstanceOf(Phone)
    assertModel(user, {
      id: 1,
      name: 'John Doe',
      phone: {
        id: 1,
        userId: 1,
        number: '123-4567-8912'
      }
    })
  })

  it('can eager load missing relation as `null`', async () => {
    const store = createStore([User, Phone])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      phones: {}
    })

    const user = store.$repo(User).with('phone').first()!

    expect(user).toBeInstanceOf(User)
    assertModel(user, {
      id: 1,
      name: 'John Doe',
      phone: null
    })
  })
})
