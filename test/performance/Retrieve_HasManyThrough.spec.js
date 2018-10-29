import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Performance – Retrieve – Has Many Through', () => {
  it('should retrieve hasManyThrough relation in time', async () => {
    class Country extends Model {
      static entity = 'countries'

      static fields () {
        return {
          id: this.attr(null),
          posts: this.hasManyThrough(Post, User, 'country_id', 'user_id')
        }
      }
    }

    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          country_id: this.attr(null)
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }
    const countries = []
    const users = []
    const posts = []

    for (let i = 1; i <= 2; i++) {
      countries.push({ id: i })
    }

    // 100 users
    for (let i = 1; i <= 100; i++) {
      let countryID = (i % 2) + 1
      users.push({ id: i, country_id: countryID })
    }

    // 1 user 100 posts
    for (let i = 1; i <= users.length; i++) {
      for (let j = 1; j <= 100; j++) {
        posts.push({ id: `${i}_${j}`, user_id: i })
      }
    }

    const store = createStore([{ model: Country }, { model: User }, { model: Post }])

    await store.dispatch('entities/countries/create', { data: countries })
    await store.dispatch('entities/users/create', { data: users })
    await store.dispatch('entities/posts/create', { data: posts })

    const start = new Date()

    store.getters['entities/countries/query']().with('posts').get(1)

    const end = new Date()

    expect(end - start).toBeLessThan(500)
    console.info('\x1b[2m%s\x1b[0m', `    -- The test took ${end - start}ms`)
  })
})
