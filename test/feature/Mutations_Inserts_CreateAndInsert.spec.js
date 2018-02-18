import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Mutations – Inserts – Create And Insert', () => {
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
        user: this.belongsTo(User, 'user_id')
      }
    }
  }

  function getStore () {
    return createStore([{ model: User }, { model: Post }])
  }

  it('can create primary data and insert nested data', () => {
    const store = getStore()

    store.commit('entities/create', {
      entity: 'posts',
      data: [
        { id: 1, user_id: 1 },
        { id: 2, user_id: 2 }
      ]
    })

    store.commit('entities/create', {
      entity: 'users',
      insert: ['posts'],
      data: {
        id: 2,
        posts: [
          { id: 2, user_id: 2 },
          { id: 3, user_id: 2 }
        ]
      }
    })

    const users = store.getters['entities/users/all']()
    const posts = store.getters['entities/posts/all']()

    expect(users.length).toBe(1)
    expect(posts.length).toBe(3)
  })

  it('can insert primary data and create nested data', () => {
    const store = getStore()

    store.commit('entities/insert', {
      entity: 'users',
      data: [{ id: 1 }, { id: 2 }]
    })

    store.commit('entities/insert', {
      entity: 'posts',
      data: [{ id: 1, user_id: 1 }, { id: 2, user_id: 1 }]
    })

    store.commit('entities/insert', {
      entity: 'users',
      create: ['posts'],
      data: {
        id: 3,
        posts: [
          { id: 3, user_id: 3 }
        ]
      }
    })

    const users = store.getters['entities/users/all']()
    const posts = store.getters['entities/posts/all']()

    expect(users.length).toBe(3)
    expect(posts.length).toBe(1)
  })
})
