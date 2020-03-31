import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Hooks – Local Delete', () => {
  it('can dispatch the `beforeDelete` hook', async () => {
    let hit = false

    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @Attribute('')
      name!: string

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      static beforeDelete () {
        hit = true
      }
    }

    createStore([{ model: User }])

    await User.create({ id: 1, name: 'John Doe' })

    await User.delete(1)

    expect(hit).toBe(true)
  })

  it('can cancel the delete by returning false from the `beforeDelete` hook', async () => {
    let hit = false

    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @Attribute('')
      name!: string

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      static beforeDelete (record: User) {
        hit = true

        return !(record.name === 'Jane Doe')
      }
    }

    createStore([{ model: User }])

    await User.create([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])

    await User.delete(2)

    const expected = [
      { $id: '1', id: 1, name: 'John Doe' },
      { $id: '2', id: 2, name: 'Jane Doe' }
    ]

    expect(hit).toBe(true)
    expect(User.all()).toEqual(expected)
  })

  it('can dispatch the `afterDelete` hook', async () => {
    let hit = false

    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @Attribute('')
      name!: string

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      static afterDelete () {
        hit = true
      }
    }

    createStore([{ model: User }])

    await User.create([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])

    await User.delete(2)

    const expected = [
      { $id: '1', id: 1, name: 'John Doe' }
    ]

    expect(hit).toBe(true)
    expect(User.all()).toEqual(expected)
  })
})
