import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Performance – Retrieve – Belongs To', () => {
  it('should retrieve belongsTo relation in time', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          user: this.belongsTo(User, 'user_id')
        }
      }
    }

    const users = []
    const posts = []

    for (let i = 1; i <= 30000; i++) {
      users.push({ id: i })
    }

    posts.push({ id: 1, user_id: 1 })
    posts.push({ id: 2, user_id: 1 })
    posts.push({ id: 3, user_id: 2 })
    posts.push({ id: 4, user_id: 2 })
    posts.push({ id: 5, user_id: 3 })
    posts.push({ id: 6, user_id: 3 })
    posts.push({ id: 7, user_id: 4 })
    posts.push({ id: 8, user_id: 4 })

    const store = createStore([{ model: User }, { model: Post }])

    await store.dispatch('entities/users/create', { data: users })
    await store.dispatch('entities/posts/create', { data: posts })

    const start = new Date()

    // store.getters['entities/posts/query']().with('user').get()

    const end = new Date()

    expect(end - start).toBeLessThan(500)

    console.info('\x1b[2m%s\x1b[0m', `    -- The test took ${end - start}ms`)
  })
})
