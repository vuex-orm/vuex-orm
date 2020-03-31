/* tslint:disable:variable-name */
import Model from '@/model/Model'

describe('Model – Relations – Morph One', () => {
  class Post extends Model {
    static entity = 'posts'

    // @Attribute
    id!: number

    // @MorphOne(Comment, 'commentable_id', 'commentable_type')
    comment!: Comment

    static fields() {
      return {
        id: this.attr(null),
        comment: this.morphOne(Comment, 'commentable_id', 'commentable_type')
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
    commentable_id!: number

    // @Attribute
    commentable_type!: string

    static fields() {
      return {
        id: this.attr(null),
        body: this.attr(''),
        commentable_id: this.attr(null),
        commentable_type: this.attr(null)
      }
    }
  }

  it('can resolve morph many relation', () => {
    const post = new Post({
      id: 1,
      comment: { id: 1, body: 'comment' }
    })

    expect(post).toBeInstanceOf(Post)
    expect(post.id).toBe(1)
    expect(post.comment).toBeInstanceOf(Comment)
    expect(post.comment.body).toBe('comment')
  })

  it('can resolve empty morph many relation', () => {
    const post = new Post({ id: 1 })

    expect(post).toBeInstanceOf(Post)
    expect(post.id).toBe(1)
    expect(post.comment).toEqual(null)
  })
})
