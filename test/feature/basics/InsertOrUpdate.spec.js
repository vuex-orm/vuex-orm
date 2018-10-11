import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Basics – Insert Or Update', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr(''),
        posts: this.hasMany(Post, 'user_id')
      }
    }
  }

  class Post extends Model {
    static entity = 'posts'

    static fields () {
      return {
        id: this.attr(null),
        user_id: this.attr(null),
        title: this.attr('')
      }
    }
  }

  function getStore () {
    return createStore([{ model: User }, { model: Post }])
  }

  it('can insert new data and update existing data', async () => {
    const store = getStore()

    await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    await store.dispatch('entities/posts/create', {
      data: { id: 1, user_id: 1, title: 'title 01' }
    })

    await store.dispatch('entities/users/insertOrUpdate', {
      data: [
        {
          id: 1,
          name: 'Jane Doe',
          posts: [{ id: 1, user_id: 1, title: 'title 02' }]
        },
        {
          id: 2,
          name: 'Johnny Doe',
          posts: [{ id: 2, user_id: 2, title: 'title 03' }]
        }
      ]
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, name: 'Jane Doe', posts: [] },
        '2': { $id: 2, id: 2, name: 'Johnny Doe', posts: [] }
      },
      posts: {
        '1': { $id: 1, id: 1, user_id: 1, title: 'title 02' },
        '2': { $id: 2, id: 2, user_id: 2, title: 'title 03' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
