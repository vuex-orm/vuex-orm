import Model from 'app/model/Model'

describe('Model – Relations – MorphMany', () => {
  class Post extends Model {
    static entity = 'posts'

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
        commentable_type: this.attr(null)
      }
    }
  }

  it('can resolve morph many relation', () => {
    const data = {
      id: 1,
      comments: [
        { id: 1, body: 'comment1' },
        { id: 2, body: 'comment2' }
      ]
    }

    const post = new Post(data)

    expect(post).toBeInstanceOf(Post)
    expect(post.id).toBe(1)
    expect(post.comments[0]).toBeInstanceOf(Comment)
    expect(post.comments[0].body).toBe('comment1')
    expect(post.comments[1]).toBeInstanceOf(Comment)
    expect(post.comments[1].body).toBe('comment2')
  })

  it('can resolve empty morph many relation', () => {
    const post = new Post({ id: 1 })

    expect(post).toBeInstanceOf(Post)
    expect(post.id).toBe(1)
    expect(post.comments).toEqual([])
  })
})
