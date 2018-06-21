import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Query – Retrieve – Relations – Morph To', () => {
  it('can resolve morph to relation', () => {
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
          commentable_type: this.attr(null),
          commentable: this.morphTo('commentable_id', 'commentable_type')
        }
      }
    }

    createStore([{ model: Post }, { model: Video }, { model: Comment }])

    const state = createState({
      posts: {
        '1': { $id: 1, id: 1 },
        '5': { $id: 5, id: 5 }
      },
      videos: {
        '3': { $id: 3, id: 3 },
      },
      comments: {
        '1': { $id: 1, id: 1, body: 'comment1', commentable_id: 1, commentable_type: 'posts' }
      }
    })

    const comment = Query.query(state, 'comments').with('commentable').find(1)

    expect(comment).toBeInstanceOf(Comment)
    expect(comment.commentable).toBeInstanceOf(Post)
  })

  it('can resolve many morph to relation', () => {
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
          commentable_type: this.attr(null),
          commentable: this.morphTo('commentable_id', 'commentable_type')
        }
      }
    }

    createStore([{ model: Post }, { model: Video }, { model: Comment }])

    const state = createState({
      posts: {
        '1': { $id: 1, id: 1 },
        '5': { $id: 5, id: 5 }
      },
      videos: {
        '3': { $id: 3, id: 3 },
      },
      comments: {
        '1': { $id: 1, id: 1, body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        '2': { $id: 2, id: 2, body: 'comment2', commentable_id: 3, commentable_type: 'videos' }
      }
    })

    const comments = Query.query(state, 'comments').with('commentable').get()

    expect(comments[0]).toBeInstanceOf(Comment)
    expect(comments[1]).toBeInstanceOf(Comment)
    expect(comments[0].commentable).toBeInstanceOf(Post)
    expect(comments[1].commentable).toBeInstanceOf(Video)
  })

  it('can resolve morph to relation with custom primary key', () => {
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

      static primaryKey = 'video_id'

      static fields () {
        return {
          video_id: this.attr(null),
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
          commentable_type: this.attr(null),
          commentable: this.morphTo('commentable_id', 'commentable_type')
        }
      }
    }

    createStore([{ model: Post }, { model: Video }, { model: Comment }])

    const state = createState({
      posts: {
        '1': { $id: 1, post_id: 1 },
        '5': { $id: 5, post_id: 5 }
      },
      videos: {
        '3': { $id: 3, video_id: 3 },
      },
      comments: {
        '1': { $id: 1, id: 1, body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        '2': { $id: 2, id: 2, body: 'comment2', commentable_id: 3, commentable_type: 'videos' }
      }
    })

    const comments = Query.query(state, 'comments').with('commentable').get()

    expect(comments[0]).toBeInstanceOf(Comment)
    expect(comments[1]).toBeInstanceOf(Comment)
    expect(comments[0].commentable).toBeInstanceOf(Post)
    expect(comments[1].commentable).toBeInstanceOf(Video)
  })
})
