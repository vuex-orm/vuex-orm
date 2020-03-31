/* tslint:disable:variable-name */
import { createStore, createState } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Features – Relations – Morph To', () => {
  it('can create data containing the morph to relation', async () => {
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
      id!: number

      // @Attribute('')
      body!: string

      // @Attribute
      commentable_id!: number

      // @Attribute
      commentable_type!: string

      // @MorphTo('commentable_id', 'commentable_type')
      commentable!: Post

      static fields() {
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

    await Comment.create({
      id: 1,
      body: 'The Body',
      commentable_type: 'posts',
      commentable_id: 1,
      commentable: { id: 1 }
    })

    const expected = createState({
      posts: {
        1: { $id: '1', id: 1, comment: null }
      },
      comments: {
        1: {
          $id: '1',
          id: 1,
          body: 'The Body',
          commentable_type: 'posts',
          commentable_id: 1,
          commentable: null
        }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can retrieve all morph relations', async () => {
    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @MorphMany(Comment, 'commentable_id', 'commentable_type')
      comments!: Comment[]

      static fields() {
        return {
          id: this.attr(null),
          comments: this.morphMany(
            Comment,
            'commentable_id',
            'commentable_type'
          )
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      // @Attribute
      id!: number

      // @MorphMany(Comment, 'commentable_id', 'commentable_type')
      comments!: Comment[]

      static fields() {
        return {
          id: this.attr(null),
          comments: this.morphMany(
            Comment,
            'commentable_id',
            'commentable_type'
          )
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      // @Attribute
      id!: number

      // @Attribute('')
      body!: string

      // @Attribute
      commentable_id!: number

      // @Attribute
      commentable_type!: string

      // @MorphTo('commentable_id', 'commentable_type')
      commentable!: Post | Video

      static fields() {
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

    await Post.insert({
      id: 1,
      comments: [
        { id: 1, body: 'comment1' },
        { id: 2, body: 'comment2' }
      ]
    })

    await Video.insert({
      id: 1,
      comments: [
        { id: 3, body: 'comment3' },
        { id: 4, body: 'comment4' }
      ]
    })

    const comments = Comment.query()
      .with('commentable')
      .get()

    expect(comments.length).toBe(4)

    expect(comments[0]).toBeInstanceOf(Comment)
    expect(comments[0].commentable).toBeInstanceOf(Post)

    expect(comments[2]).toBeInstanceOf(Comment)
    expect(comments[2].commentable).toBeInstanceOf(Video)
  })

  it('can resolve empty morph to relations', async () => {
    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @MorphMany(Comment, 'commentable_id', 'commentable_type')
      comments!: Comment[]

      static fields() {
        return {
          id: this.attr(null),
          comments: this.morphMany(
            Comment,
            'commentable_id',
            'commentable_type'
          )
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      // @Attribute
      id!: number

      // @MorphMany(Comment, 'commentable_id', 'commentable_type')
      comments!: Comment[]

      static fields() {
        return {
          id: this.attr(null),
          comments: this.morphMany(
            Comment,
            'commentable_id',
            'commentable_type'
          )
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      // @Attribute
      id!: number

      // @Attribute('')
      body!: string

      // @Attribute
      commentable_id!: number

      // @Attribute
      commentable_type!: string

      // @MorphTo('commentable_id', 'commentable_type')
      commentable!: Post | Video

      static fields() {
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

    await Comment.insert({
      id: 1,
      body: 'Body 01'
    })

    const comment = Comment.query()
      .with('commentable')
      .find(1) as Comment

    expect(comment.commentable).toBe(null)
  })
})
