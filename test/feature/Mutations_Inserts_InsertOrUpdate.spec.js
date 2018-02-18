import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Mutations – Inserts – Insert Or Update', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        posts: this.hasMany(Post, 'user_id')
      }
    }
  }

  class Post extends Model {
    static entity = 'posts'

    static fields () {
      return {
        id: this.attr(null),
        body: this.attr('')
      }
    }
  }

  function getStore () {
    return createStore([{ model: User }, { model: Post }])
  }

  it('insert new data and update existing data', () => {
    const store = getStore()

    store.commit('entities/create', {
      entity: 'posts',
      data: [
        { id: 1, user_id: 1, body: 'body' },
        { id: 2, user_id: 2, body: 'body' }
      ]
    })

    store.commit('entities/insertOrUpdate', {
      entity: 'users',
      data: {
        id: 1,
        posts: [
          { id: 1, user_id: 1, body: 'title' },
          { id: 3, user_id: 1, body: 'title' }
        ]
      }
    })

    const users = store.getters['entities/users/all']()
    const posts = store.getters['entities/posts/all']()

    expect(users.length).toBe(1)
    expect(posts.length).toBe(3)
    expect(posts[0].id).toBe(1)
    expect(posts[0].body).toBe('title')
    expect(posts[1].id).toBe(2)
    expect(posts[1].body).toBe('body')
    expect(posts[2].id).toBe(3)
    expect(posts[2].body).toBe('title')
  })
})
