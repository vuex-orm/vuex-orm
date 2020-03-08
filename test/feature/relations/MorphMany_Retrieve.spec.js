import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Relations – Morph Many – Retrieve', () => {
  it('can resolve morph many relation', async () => {
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
          commentable_type: this.attr(null)
        }
      }
    }

    createStore([{ model: Post }, { model: Video }, { model: Comment }])

    await Post.create({
      data: [{ id: 1 }, { id: 5 }, { id: 6 }]
    })

    await Video.create({
      data: { id: 3 }
    })

    await Comment.create({
      data: [
        { id: '1', body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        { id: '2', body: 'comment2', commentable_id: 3, commentable_type: 'videos' },
        { id: '3', body: 'comment3', commentable_id: 1, commentable_type: 'posts' },
        { id: '4', body: 'comment4', commentable_id: 5, commentable_type: 'posts' }
      ]
    })

    const post = Post.query().with('comments').find(1)

    expect(post.comments.length).toBe(2)
    expect(post.comments[0].body).toBe('comment1')
    expect(post.comments[1].body).toBe('comment3')

    const postWithoutComments = Post.query().with('comments').find(6)

    expect(postWithoutComments.comments.length).toBe(0)
  })

  it('can resolve morph many relation with custom primary key', async () => {
    class Post extends Model {
      static entity = 'posts'

      static primaryKey = 'post_id'

      static fields () {
        return {
          post_id: this.attr(null),
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
          commentable_type: this.attr(null)
        }
      }
    }

    createStore([{ model: Post }, { model: Video }, { model: Comment }])

    await Post.create({
      data: [{ post_id: 1 }, { post_id: 5 }]
    })

    await Video.create({
      data: { id: 3 }
    })

    await Comment.create({
      data: [
        { id: '1', body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        { id: '2', body: 'comment2', commentable_id: 3, commentable_type: 'videos' },
        { id: '3', body: 'comment3', commentable_id: 1, commentable_type: 'posts' },
        { id: '4', body: 'comment4', commentable_id: 5, commentable_type: 'posts' }
      ]
    })

    const post = Post.query().with('comments').find(1)

    expect(post.comments.length).toBe(2)
    expect(post.comments[0].body).toBe('comment1')
    expect(post.comments[1].body).toBe('comment3')
  })

  it('can resolve morph many relation with custom local key', async () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          post_id: this.attr(null),
          comments: this.morphMany(Comment, 'commentable_id', 'commentable_type', 'post_id')
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
          commentable_type: this.attr(null)
        }
      }
    }

    createStore([{ model: Post }, { model: Video }, { model: Comment }])

    await Post.create({
      data: [{ id: 2, post_id: 1 }, { id: 3, post_id: 5 }]
    })

    await Video.create({
      data: [{ id: 3 }, { id: 4 }]
    })

    await Comment.create({
      data: [
        { id: '1', body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        { id: '2', body: 'comment2', commentable_id: 3, commentable_type: 'videos' },
        { id: '3', body: 'comment3', commentable_id: 1, commentable_type: 'posts' },
        { id: '4', body: 'comment4', commentable_id: 5, commentable_type: 'posts' }
      ]
    })

    const post = Post.query().with('comments').find(2)

    expect(post.comments.length).toBe(2)
    expect(post.comments[0].body).toBe('comment1')
    expect(post.comments[1].body).toBe('comment3')

    const video = Video.query().with('comments').find(4)

    expect(video.comments.length).toBe(0)
  })

  it('can apply `orderBy` constraint on nested relations', async () => {
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
          commentable_id: this.attr(null),
          commentable_type: this.attr(null)
        }
      }
    }

    createStore([{ model: Post }, { model: Video }, { model: Comment }])

    await Post.insert({
      data: { id: 1, comments: [{ id: 1 }, { id: 3 }, { id: 2 }] }
    })

    await Video.insert({
      data: { id: 1, comments: [{ id: 4 }, { id: 6 }, { id: 5 }] }
    })

    const post = Post.query().with('comments', query => { query.orderBy('id', 'asc') }).find(1)

    expect(post.comments[0].id).toBe(1)
    expect(post.comments[1].id).toBe(2)
    expect(post.comments[2].id).toBe(3)

    const video = Video.query().with('comments', query => { query.orderBy('id', 'desc') }).find(1)

    expect(video.comments[0].id).toBe(6)
    expect(video.comments[1].id).toBe(5)
    expect(video.comments[2].id).toBe(4)
  })
})
