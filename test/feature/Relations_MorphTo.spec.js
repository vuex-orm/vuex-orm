import { createStore } from 'test/support/Helpers'
import Model from 'app/Model'

describe('Features – Relations – Morph To', () => {
  it('can retrieve all morph relations', async () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      static fields () {
        return {
          id: this.attr(null),
          body: this.attr(''),
          commentable_id: this.attr(null),
          commentable_type: this.attr(null),
          commentable: this.morphTo('commentable_id', 'commentable_type')
        }
      }
    }

    const store = createStore([{ model: Post }, { model: Video }, { model: Comment }])

    await store.dispatch('entities/posts/insert', {
      data: {
        id: 1,
        comments: [
          { id: 1, body: 'comment1' },
          { id: 2, body: 'comment2' }
        ]
      }
    })

    await store.dispatch('entities/videos/insert', {
      data: {
        id: 1,
        comments: [
          { id: 3, body: 'comment3' },
          { id: 4, body: 'comment4' }
        ]
      }
    })

    const comments = store.getters['entities/comments/query']().with('commentable').get()

    expect(comments.length).toBe(4)
    expect(comments[0]).toBeInstanceOf(Comment)
    expect(comments[0].commentable).toBeInstanceOf(Post)
    expect(comments[2]).toBeInstanceOf(Comment)
    expect(comments[2].commentable).toBeInstanceOf(Video)
  })
})
