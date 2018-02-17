import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Relations – Morph One', () => {
  it('can resolve a morph one relation', async () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          comment: this.morphOne(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      static fields () {
        return {
          id: this.attr(null),
          comment: this.morphOne(Comment, 'commentable_id', 'commentable_type')
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
          commentable_type: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: Post }, { model: Video }, { model: Comment }])

    await store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        comment: { id: 1, body: 'comment1', commentabe_id: 1, commentable_type: 'posts' }
      }
    })

    const post = store.getters['entities/posts/query']().with('comment').find(1)

    expect(post).toBeInstanceOf(Post)
    expect(post.comment).toBeInstanceOf(Comment)
  })

  it('generates id or type for the moprh relation', async () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          comment: this.morphOne(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      static fields () {
        return {
          id: this.attr(null),
          comment: this.morphOne(Comment, 'commentable_id', 'commentable_type')
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
          commentable_type: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: Post }, { model: Video }, { model: Comment }])

    await store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        comment: { id: 1, body: 'comment1' }
      }
    })

    const post = store.getters['entities/posts/query']().with('comment').find(1)

    expect(post).toBeInstanceOf(Post)
    expect(post.comment).toBeInstanceOf(Comment)
  })
})
