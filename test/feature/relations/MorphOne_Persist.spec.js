import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Relations – Morph One – Persist', () => {
  it('can create data containing the morph one relation', () => {
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
          commentable_type: this.attr(null),
          commentable: this.morphTo('commentable_id', 'commentable_type')
        }
      }
    }

    const store = createStore([{ model: Post }, { model: Comment }])

    store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        comment: {
          id: 1,
          body: 'The Body',
          commentable_type: 'posts',
          commentable_id: 1
        }
      }
    })

    const expected = createState({
      posts: {
        '1': { $id: 1, id: 1, comment: null }
      },
      comments: {
        '1': { $id: 1, id: 1, body: 'The Body', commentable_type: 'posts', commentable_id: 1, commentable: null }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('generates id and types for the morph one relations', async () => {
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
      data: {
        id: 1,
        comment: { id: 2, body: 'comment1' }
      }
    })

    expect(store.state.entities.posts.data['1'].id).toBe(1)
    expect(store.state.entities.comments.data['2'].id).toBe(2)
    expect(store.state.entities.comments.data['2'].commentable_id).toBe(1)
    expect(store.state.entities.comments.data['2'].commentable_type).toBe('posts')
  })

  it('generates only missing id or types for the morph one relations', async () => {
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
      data: {
        id: 1,
        comment: { id: 2, body: 'comment1', commentable_id: 1 }
      }
    })

    const expected = createState({
      posts: {
        '1': { $id: 1, id: 1, comment: null }
      },
      videos: {},
      comments: {
        '2': { $id: 2, id: 2, body: 'comment1', commentable_id: 1, commentable_type: 'posts' }
      }
    })

    expect(store.state.entities.posts.data['1'].id).toBe(1)
    expect(store.state.entities.comments.data['2'].id).toBe(2)
    expect(store.state.entities.comments.data['2'].commentable_id).toBe(1)
    expect(store.state.entities.comments.data['2'].commentable_type).toBe('posts')
  })

  it('would not generate id or types for non nested relations', async () => {
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

    await Comment.create({
      data: [
        { id: 2, body: 'comment1' },
        { id: 3, body: 'comment2' }
      ]
    })

    expect(store.state.entities.comments.data['2'].id).toBe(2)
    expect(store.state.entities.comments.data['2'].commentable_id).toBe(null)
    expect(store.state.entities.comments.data['2'].commentable_type).toBe(null)
    expect(store.state.entities.comments.data['3'].id).toBe(3)
    expect(store.state.entities.comments.data['3'].commentable_id).toBe(null)
    expect(store.state.entities.comments.data['3'].commentable_type).toBe(null)
  })

  it('generates id or types for the deeply nested morph one relations', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr('null'),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
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

    const store = createStore([{ model: User }, { model: Post }, { model: Video }, { model: Comment }])

    await User.create({
      data: {
        id: 1,
        posts: [{
          id: 5,
          user_id: 1,
          comment: { id: 2, body: 'comment1', commentable_id: 1 }
        }]
      }
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, posts: [] }
      },
      posts: {
        '5': { $id: 5, id: 5, user_id: 1, comment: null }
      },
      videos: {},
      comments: {
        '2': { $id: 2, id: 2, body: 'comment1', commentable_id: 1, commentable_type: 'posts' }
      }
    })

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.posts.data['5'].id).toBe(5)
    expect(store.state.entities.comments.data['2'].id).toBe(2)
    expect(store.state.entities.comments.data['2'].commentable_id).toBe(1)
    expect(store.state.entities.comments.data['2'].commentable_type).toBe('posts')
  })

  it('can create data containing the empty morph one relation', () => {
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
          commentable_type: this.attr(null),
          commentable: this.morphTo('commentable_id', 'commentable_type')
        }
      }
    }

    const store = createStore([{ model: Post }, { model: Comment }])

    store.dispatch('entities/posts/create', {
      data: [
        {
          id: 1,
          comment: {
            id: 1,
            body: 'The Body',
            commentable_type: 'posts',
            commentable_id: 1
          }
        },
        {
          id: 2,
          comment: null
        }
      ]
    })

    const expected = createState({
      posts: {
        '1': { $id: 1, id: 1, comment: null },
        '2': { $id: 2, id: 2, comment: null }
      },
      comments: {
        '1': { $id: 1, id: 1, body: 'The Body', commentable_type: 'posts', commentable_id: 1, commentable: null }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can resolve a morph one relation', async () => {
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

    await store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        comment: { id: 1, body: 'comment1', commentabe_id: 1, commentable_type: 'posts' }
      }
    })

    const post = store.getters['entities/posts/query']().with('comment').find(1)

    expect(post).toBeInstanceOf(Post)
    expect(post.comment).toBeInstanceOf(Comment)
  })

  it('generates id or type for the moprh relation', async () => {
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

    await store.dispatch('entities/posts/create', {
      data: {
        id: 1,
        comment: { id: 1, body: 'comment1' }
      }
    })

    const post = store.getters['entities/posts/query']().with('comment').find(1)

    expect(post).toBeInstanceOf(Post)
    expect(post.comment).toBeInstanceOf(Comment)
  })
})
