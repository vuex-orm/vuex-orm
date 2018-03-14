import { createApplication } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Query – Retrieve – Relations - String Define', () => {
  it('can define related model via string', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          posts: this.hasMany('posts', 'user_id')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
        }
      }
    }

    createApplication('entities', [{ model: User }, { model: Post }])

    const state = {
      name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1 }
      }},
      posts: { data: {
        '2': { $id: 2, id: 2, user_id: 1 }
      }}
    }

    const user = Query.query(state, 'users').with('posts').find(1)

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(1)
    expect(user.posts[0]).toBeInstanceOf(Post)
    expect(user.posts[0].id).toBe(2)
  })
})
