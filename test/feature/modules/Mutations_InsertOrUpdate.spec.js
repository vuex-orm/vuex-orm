import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Mutations – Insert Or Update', () => {
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
        user_id: this.attr(''),
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

    const expected = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, posts: [1, 3] }
      },
      posts: {
        '1': { $id: 1, id: 1, user_id: 1, body: 'title' },
        '2': { $id: 2, id: 2, user_id: 2, body: 'body' },
        '3': { $id: 3, id: 3, user_id: 1, body: 'title' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
