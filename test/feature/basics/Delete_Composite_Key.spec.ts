import { createStore, createState } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Basics – Delete Composite Key', () => {
  class User extends Model {
    static entity = 'users'

    static primaryKey = ['first_id', 'second_id']

    static fields () {
      return {
        first_id: this.attr(null),
        second_id: this.attr(null)
      }
    }
  }

  const getStore = () => createStore([{ model: User }])

  it('can delete a record by specifying the composite id as an array', async () => {
    const store = getStore()

    await User.create([
      { first_id: 1, second_id: 1 },
      { first_id: 1, second_id: 2 }
    ])

    await User.delete([1, 1])

    const expected = createState({
      users: {
        '[1,2]': { $id: '[1,2]', first_id: 1, second_id: 2 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('deletes itself by instance method even when model has composite primary key', async () => {
    const store = getStore()

    await User.create([
      { first_id: 1, second_id: 2 },
      { first_id: 3, second_id: 4 }
    ])

    const user = User.find([1, 2]) as User

    await user.$delete()

    const expected = createState({
      users: {
        '[3,4]': { $id: '[3,4]', first_id: 3, second_id: 4 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
