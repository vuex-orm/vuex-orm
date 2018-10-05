import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Relations – Persist – Nested Morph', () => {
  it('can create data with nested morph one and morph to relationship', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.hasMany(Comment, 'user_id')
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

    class Comment extends Model {
      static entity = 'comments'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          commentable_id: this.attr(null),
          commentable_type: this.attr(null),
          commentable: this.morphTo('commentable_id', 'commentable_type')
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }, { model: Comment }])

    store.dispatch('entities/users/create', {
      data: {
        id: 1,
        comments: [
          {
            id: 1,
            user_id: 1,
            commentable_id: 1,
            commentable_type: 'posts',
            commentable: { id: 1 }
          }
        ]
      }
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, comments: [] }
      },
      posts: {
        '1': { $id: 1, id: 1 }
      },
      comments: {
        '1': { $id: 1, id: 1, user_id: 1, commentable_type: 'posts', commentable_id: 1, commentable: {
          $id: undefined, id: 1
        }}
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
