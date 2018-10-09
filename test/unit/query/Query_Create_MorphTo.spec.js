import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Query – Create – Morph To', () => {
  it('can create a morph to relation data', () => {
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
      posts: {},
      videos: {},
      comments: {}
    })

    const data = {
      id: 1,
      body: 'comment1',
      commentable_id: 2,
      commentable_type: 'posts',
      commentable: { id: 2 }
    }

    const expected = createState({
      posts: {
        '2': { $id: 2, id: 2, comment: null }
      },
      videos: {},
      comments: {
        '1': {
          $id: 1,
          id: 1,
          body: 'comment1',
          commentable_id: 2,
          commentable_type: 'posts',
          commentable: { $id: null, comment: null, id: 2 }
        }
      }
    })

    Query.create(state, 'comments', data)

    expect(state).toEqual(expected)
  })

  it('can create many morph to relation data', () => {
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
      posts: {},
      videos: {},
      comments: {}
    })

    const data = [
      {
        id: 1,
        body: 'comment1',
        commentable_id: 2,
        commentable_type: 'posts',
        commentable: { id: 2 }
      },
      {
        id: 2,
        body: 'comment2',
        commentable_id: 2,
        commentable_type: 'videos',
        commentable: { id: 2 }
      }
    ]

    const expected = createState({
      posts: {
        '2': { $id: 2, id: 2, comment: null }
      },
      videos: {
        '2': { $id: 2, id: 2, comment: null }
      },
      comments: {
        '1': {
          $id: 1,
          id: 1,
          body: 'comment1',
          commentable_id: 2,
          commentable_type: 'posts',
          commentable: { $id: null, comment: null, id: 2 }
        },
        '2': {
          $id: 2,
          id: 2,
          body: 'comment2',
          commentable_id: 2,
          commentable_type: 'videos',
          commentable: { $id: null, comment: null, id: 2 }
        }
      }
    })

    Query.create(state, 'comments', data)

    expect(state).toEqual(expected)
  })
})
