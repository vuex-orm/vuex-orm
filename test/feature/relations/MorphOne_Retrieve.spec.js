import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Relations – Morph One – Retrieve', () => {
  it('can resolve morph one relation', async () => {
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

    await Post.create({
      data: [{ id: 1 }, { id: 5 }]
    })

    await Video.create({
      data: { id: 3 }
    })

    await Comment.create({
      data: [
        { $id: '1', id: '1', body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        { $id: '2', id: '2', body: 'comment2', commentable_id: 3, commentable_type: 'videos' },
        { $id: '3', id: '3', body: 'comment3', commentable_id: 2, commentable_type: 'posts' },
        { $id: '4', id: '4', body: 'comment4', commentable_id: 5, commentable_type: 'posts' }
      ]
    })

    const post = Post.query().with('comment').find(1)

    expect(post.comment.body).toBe('comment1')
  })

  it('can resolve empty morph one relation', async () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.morphOne(Comment, 'commentable_id', 'commentable_type')
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.morphOne(Comment, 'commentable_id', 'commentable_type')
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

    await Post.create({
      data: [{ id: 1 }, { id: 5 }]
    })

    await Video.create({
      data: { id: 3 }
    })

    const post = Post.query().with('comment').find(1)

    expect(post.comments).toBe(null)
  })

  it('can resolve morph one relation with custom primary key', async () => {
    class Post extends Model {
      static entity = 'posts'

      static primaryKey = 'post_id'

      static fields () {
        return {
          post_id: this.attr(null),
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

    await Post.create({
      data: [{ post_id: 1 }, { post_id: 5 }]
    })

    await Video.create({
      data: { id: 3 }
    })

    await Comment.create({
      data: [
        { $id: '1', id: '1', body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        { $id: '2', id: '2', body: 'comment2', commentable_id: 3, commentable_type: 'videos' },
        { $id: '3', id: '3', body: 'comment3', commentable_id: 2, commentable_type: 'posts' },
        { $id: '4', id: '4', body: 'comment4', commentable_id: 5, commentable_type: 'posts' }
      ]
    })

    const post = Post.query().with('comment').find(1)

    expect(post.comment.body).toBe('comment1')
  })

  it('can resolve morph one relation with custom local key', async () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          post_id: this.attr(null),
          comment: this.morphOne(Comment, 'commentable_id', 'commentable_type', 'post_id')
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

    await Post.create({
      data: [{ id: 2, post_id: 1 }, { id: 3, post_id: 5 }]
    })

    await Video.create({
      data: { id: 3 }
    })

    await Comment.create({
      data: [
        { $id: '1', id: '1', body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        { $id: '2', id: '2', body: 'comment2', commentable_id: 3, commentable_type: 'videos' },
        { $id: '3', id: '3', body: 'comment3', commentable_id: 2, commentable_type: 'posts' },
        { $id: '4', id: '4', body: 'comment4', commentable_id: 5, commentable_type: 'posts' }
      ]
    })

    const post = Post.query().with('comment').find(2)

    expect(post.comment.body).toBe('comment1')
  })
})
