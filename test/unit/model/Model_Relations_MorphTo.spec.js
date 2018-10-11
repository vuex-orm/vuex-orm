import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Model – Relations – Morph To', () => {
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

  it('can resolve morph to relation', () => {
    createStore([{ model: Post }, { model: Video }, { model: Comment }])

    const data = {
      id: 1,
      body: 'comment1',
      commentable_id: 1,
      commentable_type: 'posts',
      commentable: { id: 1 }
    }

    const comment = new Comment(data)

    expect(comment).toBeInstanceOf(Comment)
    expect(comment.id).toBe(1)
    expect(comment.commentable).toBeInstanceOf(Post)
  })

  it('can resolve empty morph many relation', () => {
    createStore([{ model: Post }, { model: Video }, { model: Comment }])

    const comment = new Comment({
      id: 1,
      body: 'comment1',
      commentable_id: null,
      commentable_type: null,
      commentable: null
    })

    expect(comment).toBeInstanceOf(Comment)
    expect(comment.id).toBe(1)
    expect(comment.commentable).toEqual(null)
  })

  it('resolves unkown model to null', () => {
    createStore([{ model: Post }, { model: Video }, { model: Comment }])

    const comment = new Comment({
      id: 1,
      body: 'comment1',
      commentable_id: 1,
      commentable_type: 'Unkown',
      commentable: {
        id: 1
      }
    })

    expect(comment).toBeInstanceOf(Comment)
    expect(comment.id).toBe(1)
    expect(comment.commentable).toEqual(null)
  })
})
