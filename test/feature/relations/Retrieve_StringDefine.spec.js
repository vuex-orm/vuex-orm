import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Feature – Relations - String Define', () => {
  it('can define related model via string', async () => {
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

    createStore([{ model: User }, { model: Post }])

    await User.create({
      data: { id: 1 }
    })

    await Post.create({
      data: { id: 2, user_id: 1 }
    })

    const user = User.query().with('posts').find(1)

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(1)
    expect(user.posts[0]).toBeInstanceOf(Post)
    expect(user.posts[0].id).toBe(2)
  })
})
