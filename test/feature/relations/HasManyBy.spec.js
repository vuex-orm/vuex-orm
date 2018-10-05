import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Relations – Has Many By', () => {
  it('can create data containing the has many by relation', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          posts: this.hasManyBy(Post, 'posts')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/users/create', {
      data: {
        id: 1,
        posts: [
          { id: 1 },
          { id: 2 }
        ]
      }
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, posts: [] }
      },
      posts: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can resolve the has many by relation', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          post_ids: this.attr([]),
          posts: this.hasManyBy(Post, 'post_ids')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/users/create', {
      data: {
        id: 1,
        posts: [
          { id: 1 },
          { id: 2 }
        ]
      }
    })

    const expected = {
      $id: 1,
      id: 1,
      post_ids: [1, 2],
      posts: [
        { $id: 1, id: 1 },
        { $id: 2, id: 2 }
      ]
    }

    const user = store.getters['entities/users/query']().with('posts').find(1)

    expect(user).toEqual(expected)
  })
})
