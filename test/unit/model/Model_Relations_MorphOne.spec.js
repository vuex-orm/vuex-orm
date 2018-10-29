import Model from 'app/model/Model'

describe('Model – Relations – Morph One', () => {
  class Post extends Model {
    static entity = 'posts'

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

  it('can resolve morph many relation', () => {
    const data = {
      id: 1,
      comment: { id: 1, body: 'comment' }
    }

    const post = new Post(data)

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
