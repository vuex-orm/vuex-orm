import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Model – Relations – Morph To', () => {
  class Post extends Model {
    static entity = 'posts'

    // @Attribute
    id!: number

    // @MorphMany(Comment, 'commentable_id', 'commentable_type')
    comments!: Comment[]

    static fields () {
      return {
        id: this.attr(null),
        comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
      }
    }
  }

  class Video extends Model {
    static entity = 'videos'

    // @Attribute
    id!: number

    // @MorphMany(Comment, 'commentable_id', 'commentable_type')
    comments!: Comment[]

    static fields () {
      return {
        id: this.attr(null),
        comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
      }
    }
  }

  class Comment extends Model {
    static entity = 'comments'

    // @Attribute
    id!: string

    // @Attribute('')
    body!: string

    // @Attribute
    commentable_id!: string | number

    // @Attribute
    commentable_type!: string

    // @MorphTo('commentable_id', 'commentable_type')
    commentable!: Post | Video

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

  beforeEach(() => {
    createStore([{ model: Post }, { model: Video }, { model: Comment }])
  })

  it('can resolve morph to relation', () => {
    const comment = new Comment({
      id: 1,
      body: 'comment1',
      commentable_id: 1,
      commentable_type: 'posts',
      commentable: { id: 1 }
    })

    expect(comment).toBeInstanceOf(Comment)
    expect(comment.id).toBe(1)
    expect(comment.commentable).toBeInstanceOf(Post)
  })

  it('can resolve empty morph many relation', () => {
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

  it('resolves unknown model to null', () => {
    const comment = new Comment({
      id: 1,
      body: 'comment1',
      commentable_id: 1,
      commentable_type: 'Unknown',
      commentable: {
        id: 1
      }
    })

    expect(comment).toBeInstanceOf(Comment)
    expect(comment.id).toBe(1)
    expect(comment.commentable).toEqual(null)
  })
})
