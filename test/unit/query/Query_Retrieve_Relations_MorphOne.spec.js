import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Query – Retrieve – Relations – Morph One', () => {
  it('can resolve morph one relation', () => {
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
        '1': { $id: '1', id: '1', body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        '2': { $id: '2', id: '2', body: 'comment2', commentable_id: 3, commentable_type: 'videos' },
        '3': { $id: '3', id: '3', body: 'comment3', commentable_id: 2, commentable_type: 'posts' },
        '4': { $id: '4', id: '4', body: 'comment4', commentable_id: 5, commentable_type: 'posts' }
      }
    })

    const post = Query.query(state, 'posts').with('comment').find(1)

    expect(post.comment.body).toBe('comment1')
  })

  it('can resolve empty morph one relation', () => {
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

    createStore([{ model: Post }, { model: Video }, { model: Comment }])

    const state = createState({
      posts: {
        '1': { $id: 1, id: 1 },
        '5': { $id: 5, id: 5 }
      },
      videos: {
        '3': { $id: 3, id: 3 },
      },
      comments: {}
    })

    const post = Query.query(state, 'posts').with('comment').find(1)

    expect(post.comments).toBe(null)
  })

  it('can resolve morph one relation with custom primary key', () => {
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

    createStore([{ model: Post }, { model: Video }, { model: Comment }])

    const state = createState({
      posts: {
        '1': { $id: 1, post_id: 1 },
        '5': { $id: 5, post_id: 5 }
      },
      videos: {
        '3': { $id: 3, id: 3 },
      },
      comments: {
        '1': { $id: '1', id: '1', body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        '2': { $id: '2', id: '2', body: 'comment2', commentable_id: 3, commentable_type: 'videos' },
        '3': { $id: '3', id: '3', body: 'comment3', commentable_id: 2, commentable_type: 'posts' },
        '4': { $id: '4', id: '4', body: 'comment4', commentable_id: 5, commentable_type: 'posts' }
      }
    })

    const post = Query.query(state, 'posts').with('comment').find(1)

    expect(post.comment.body).toBe('comment1')
  })

  it('can resolve morph one relation with custom local key', () => {
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

    createStore([{ model: Post }, { model: Video }, { model: Comment }])

    const state = createState({
      posts: {
        '2': { $id: 2, id: 2, post_id: 1 },
        '3': { $id: 5, id: 3, post_id: 5 }
      },
      videos: {
        '3': { $id: 3, id: 3 },
      },
      comments: {
        '1': { $id: '1', id: '1', body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        '2': { $id: '2', id: '2', body: 'comment2', commentable_id: 3, commentable_type: 'videos' },
        '3': { $id: '3', id: '3', body: 'comment3', commentable_id: 2, commentable_type: 'posts' },
        '4': { $id: '4', id: '4', body: 'comment4', commentable_id: 5, commentable_type: 'posts' }
      }
    })

    const post = Query.query(state, 'posts').with('comment').find(2)

    expect(post.comment.body).toBe('comment1')
  })
})
