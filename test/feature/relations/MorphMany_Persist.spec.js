import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Relations – Morph Many – Persist', () => {
  it('can create a data with morph many relation', async () => {
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

    const store = createStore([{ model: Post }, { model: Video }, { model: Comment }])

    await Post.create({
      data: {
        id: 1,
        comments: [
          { id: 2, body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
          { id: 3, body: 'comment2', commentable_id: 1, commentable_type: 'posts' }
        ]
      }
    })

    const expected = createState({
      posts: {
        '1': { $id: 1, id: 1, comments: [] }
      },
      videos: {},
      comments: {
        '2': { $id: 2, id: 2, body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        '3': { $id: 3, id: 3, body: 'comment2', commentable_id: 1, commentable_type: 'posts' }
      }
    })

    expect(store.state.entities.posts.data['1'].id).toBe(1)
    expect(store.state.entities.comments.data['2'].id).toBe(2)
    expect(store.state.entities.comments.data['2'].commentable_type).toBe('posts')
    expect(store.state.entities.comments.data['3'].id).toBe(3)
    expect(store.state.entities.comments.data['3'].commentable_type).toBe('posts')
  })

  it('can create many data with many morph many relation', async () => {
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

    const store = createStore([{ model: Post }, { model: Video }, { model: Comment }])

    await Post.create({
      data: [
        {
          id: 1,
          comments: [
            { id: 2, body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
            { id: 3, body: 'comment2', commentable_id: 1, commentable_type: 'posts' }
          ]
        },
        {
          id: 2,
          comments: [
            { id: 4, body: 'comment3', commentable_id: 2, commentable_type: 'posts' }
          ]
        }
      ]
    })

    expect(store.state.entities.posts.data['1'].id).toBe(1)
    expect(store.state.entities.posts.data['2'].id).toBe(2)
    expect(store.state.entities.comments.data['2'].id).toBe(2)
    expect(store.state.entities.comments.data['2'].commentable_type).toBe('posts')
    expect(store.state.entities.comments.data['3'].id).toBe(3)
    expect(store.state.entities.comments.data['3'].commentable_type).toBe('posts')
    expect(store.state.entities.comments.data['4'].id).toBe(4)
    expect(store.state.entities.comments.data['4'].commentable_type).toBe('posts')
  })

  it('generates id and types for the morph many relations', async () => {
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

    const store = createStore([{ model: Post }, { model: Video }, { model: Comment }])

    await Post.create({
      data: {
        id: 1,
        comments: [
          { id: 2, body: 'comment1' },
          { id: 3, body: 'comment2' }
        ]
      }
    })

    const expected = createState({
      posts: {
        '1': { $id: 1, id: 1, comments: [] }
      },
      videos: {},
      comments: {
        '2': { $id: 2, id: 2, body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        '3': { $id: 3, id: 3, body: 'comment2', commentable_id: 1, commentable_type: 'posts' }
      }
    })

    expect(store.state.entities.posts.data['1'].id).toBe(1)
    expect(store.state.entities.comments.data['2'].id).toBe(2)
    expect(store.state.entities.comments.data['2'].commentable_type).toBe('posts')
    expect(store.state.entities.comments.data['3'].id).toBe(3)
    expect(store.state.entities.comments.data['3'].commentable_type).toBe('posts')
  })

  it('generates only missing id or types for the morph many relations', async () => {
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

    const store = createStore([{ model: Post }, { model: Video }, { model: Comment }])

    await Post.create({
      data: {
        id: 1,
        comments: [
          { id: 2, body: 'comment1', commentable_id: 1 },
          { id: 3, body: 'comment2', commentable_id: 2 }
        ]
      }
    })

    const data = {
      id: 1,
      comments: [
        { id: 2, body: 'comment1', commentable_id: 1 },
        { id: 3, body: 'comment2', commentable_id: 2 }
      ]
    }

    expect(store.state.entities.posts.data['1'].id).toBe(1)
    expect(store.state.entities.comments.data['2'].id).toBe(2)
    expect(store.state.entities.comments.data['2'].commentable_type).toBe('posts')
    expect(store.state.entities.comments.data['3'].id).toBe(3)
    expect(store.state.entities.comments.data['3'].commentable_type).toBe('posts')
  })

  it('would not generate id or types for non nested relations', async () => {
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

    const store = createStore([{ model: Post }, { model: Video }, { model: Comment }])

    await Comment.create({
      data: [
        { id: 2, body: 'comment1' },
        { id: 3, body: 'comment2' }
      ]
    })

    const expected = createState({
      posts: {},
      videos: {},
      comments: {
        '2': { $id: 2, id: 2, body: 'comment1', commentable_id: null, commentable_type: null },
        '3': { $id: 3, id: 3, body: 'comment2', commentable_id: null, commentable_type: null }
      }
    })

    expect(store.state.entities.comments.data['2'].id).toBe(2)
    expect(store.state.entities.comments.data['2'].commentable_id).toBe(null)
    expect(store.state.entities.comments.data['2'].commentable_type).toBe(null)
    expect(store.state.entities.comments.data['3'].id).toBe(3)
    expect(store.state.entities.comments.data['2'].commentable_id).toBe(null)
    expect(store.state.entities.comments.data['3'].commentable_type).toBe(null)
  })

  it('generates id or types for the deeply nested morph many relations', async () => {
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

    const store = createStore([{ model: User }, { model: Post }, { model: Video }, { model: Comment }])

    await User.create({
      data: {
        id: 1,
        posts: [{
          id: 5,
          user_id: 1,
          comments: [
            { id: 2, body: 'comment1', commentable_id: 1 },
            { id: 3, body: 'comment2', commentable_id: 2 }
          ]
        }]
      }
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, posts: [] }
      },
      posts: {
        '5': { $id: 5, id: 5, user_id: 1, comments: [] }
      },
      videos: {},
      comments: {
        '2': { $id: 2, id: 2, body: 'comment1', commentable_id: 1, commentable_type: 'posts' },
        '3': { $id: 3, id: 3, body: 'comment2', commentable_id: 2, commentable_type: 'posts' }
      }
    })

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.posts.data['5'].id).toBe(5)
    expect(store.state.entities.comments.data['2'].id).toBe(2)
    expect(store.state.entities.comments.data['2'].commentable_id).toBe(1)
    expect(store.state.entities.comments.data['2'].commentable_type).toBe('posts')
    expect(store.state.entities.comments.data['3'].id).toBe(3)
    expect(store.state.entities.comments.data['3'].commentable_id).toBe(2)
    expect(store.state.entities.comments.data['3'].commentable_type).toBe('posts')
  })

  it('can create morph many relation with value of null', async () => {
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

    const store = createStore([{ model: Post }, { model: Comment }])

    await store.dispatch('entities/posts/create', {
      data: { id: 1, comments: null }
    })

    const expected = createState({
      posts: {
        '1': { $id: 1, id: 1, comments: [] }
      },
      comments: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can resolve a morph many relation', async () => {
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
      static entity = 'comment'

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
        comments: [
          { id: 1, body: 'comment1', commentabe_id: 1, commentable_type: 'posts' },
          { id: 2, body: 'comment2', commentabe_id: 1, commentable_type: 'posts' }
        ]
      }
    })

    const post = store.getters['entities/posts/query']().with('comments').find(1)

    expect(post).toBeInstanceOf(Post)
    expect(post.comments.length).toBe(2)
    expect(post.comments[0]).toBeInstanceOf(Comment)
    expect(post.comments[1]).toBeInstanceOf(Comment)
  })

  it('generates id or type for the moprh relation', async () => {
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
      static entity = 'comment'

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
        comments: [
          { id: 1, body: 'comment1' },
          { id: 2, body: 'comment2' }
        ]
      }
    })

    const post = store.getters['entities/posts/query']().with('comments').find(1)

    expect(post).toBeInstanceOf(Post)
    expect(post.comments.length).toBe(2)
    expect(post.comments[0]).toBeInstanceOf(Comment)
    expect(post.comments[1]).toBeInstanceOf(Comment)
  })
})
