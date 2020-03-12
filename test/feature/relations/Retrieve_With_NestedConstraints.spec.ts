import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Relations – With – Nested Constraints', () => {
  it('can apply `with` constraints to nested relationships', () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @HasMany(Post, 'user_id')
      posts!: Post[]

      static fields () {
        return {
          id: this.attr(null),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @Attribute
      user_id!: number

      // @HasMany(Comment, 'post_id')
      comments!: Comment[]

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          comments: this.hasMany(Comment, 'post_id')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      // @Attribute
      id!: number

      // @Attribute('')
      title!: string

      // @Attribute
      user_id!: number

      static fields () {
        return {
          id: this.attr(null),
          title: this.attr(''),
          post_id: this.attr(null)
        }
      }
    }

    createStore([{ model: User }, { model: Post }, { model: Comment }])

    User.create({ data: { id: 1 } })

    Post.create({ data: { id: 1, user_id: 1 } })

    Comment.create({
      data: [
        { id: 1, post_id: 1, title: 'Title01' },
        { id: 2, post_id: 1, title: 'Title01' },
        { id: 3, post_id: 1, title: 'Title02' }
      ]
    })

    const user = User.query().with('posts.comments', (query) => {
      query.where('title', 'Title01')
    }).find(1) as User

    expect(user.posts.length).toBe(1)
    expect(user.posts[0].comments.length).toBe(2)
    expect(user.posts[0].comments[0].title).toBe('Title01')
  })
})
