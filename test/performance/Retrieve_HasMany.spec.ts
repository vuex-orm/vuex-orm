import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Performance – Retrieve – Has Many', () => {
  it('should retrieve hasMany relation in time', async () => {
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
          user_id: this.attr(null)
        }
      }
    }

    const users = []
    const posts = []

    for (let i = 1; i <= 2000; i++) {
      users.push({ id: i })
    }

    for (let i = 1; i <= 2000; i++) {
      posts.push({ id: i })
    }

    const store = createStore([{ model: User }, { model: Post }])

    await store.dispatch('entities/users/create', { data: users })
    await store.dispatch('entities/posts/create', { data: posts })

    const start = +new Date()

    store.getters['entities/users/query']().with('posts').get()

    const end = +new Date()

    expect(end - start).toBeLessThan(300)
    console.info('\x1b[2m%s\x1b[0m', `    -- The test took ${end - start}ms`)
  })
})
