import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'
import Query from '@/query/Query'

describe('Feature – Relations – Retrieve – Constraint', () => {
  class User extends Model {
    static entity = 'users'

    static fields() {
      return {
        id: this.attr(null),
        posts: this.hasMany(Post, 'user_id')
      }
    }
  }

  class Post extends Model {
    static entity = 'posts'

    static fields() {
      return {
        id: this.attr(null),
        user_id: this.attr(null),
        user: this.belongsTo(User, 'user_id')
      }
    }
  }

  it('can resolve relation constraint', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    })

    await store.dispatch('entities/posts/create', {
      data: [
        { id: 1, user_id: 1 },
        { id: 2, user_id: 1 },
        { id: 3, user_id: 2 }
      ]
    })

    const expected = {
      $id: '1',
      id: 1,
      posts: [{ $id: '1', id: 1, user_id: 1, user: null }]
    }

    const user = store.getters['entities/users/query']()
      .with('posts', (query: Query) => {
        query.where('id', 1)
      })
      .first()

    expect(user).toEqual(expected)
  })
})
