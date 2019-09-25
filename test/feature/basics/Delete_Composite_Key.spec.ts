import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

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

  it('deletes itself by instance method even when model has composite primary key', async () => {
    const store = createStore([{ model: User }])

    await User.create({
      data: [
        { first_id: 1, second_id: 2 },
        { first_id: 3, second_id: 4 }
      ]
    })

    const user = User.query().where('first_id', 1).where('second_id', 2).first() as User

    await user.$delete()

    const expected = createState({
      users: {
        '[3,4]': { $id: [3, 4], first_id: 3, second_id: 4 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
