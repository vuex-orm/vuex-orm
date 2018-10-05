import { createStore, createState, refreshNoKey } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Attributes – Increment', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.increment(),
        posts: this.hasMany(Post, 'user_id')
      }
    }
  }

  class Post extends Model {
    static entity = 'posts'

    static fields () {
      return {
        id: this.increment(),
        user_id: this.attr(null),
      }
    }
  }

  beforeEach(() => {
    refreshNoKey()
  })

  it('converts a non-number value to the `null` when creating a record', async () => {
    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 'Not number' }
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, posts: []},
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('converts a non-number value to the `null` when instantiating a model', async () => {
    const user = new User({ id: 'Not number' })

    expect(user.id).toBe(null)
  })

  it('create auto increment with nested object', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/users/create', {
      data: {
        id: 1,
        posts: [
          { id: '', user_id: 1 },
          { id: '', user_id: 2 }
        ]
      }
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, posts: [] }
      },
      posts: {
        '1': { $id: 1, id: 1, user_id: 1 },
        '2': { $id: 2, id: 2, user_id: 2 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
