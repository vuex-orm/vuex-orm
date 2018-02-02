import { createApplication } from 'test/support/Helpers'
import Model from 'app/Model'
import Repo from 'app/repo/Repo'

describe('Repo – Retrieve – Relations – Has Many', () => {
  it('can resolve has many relation', () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          comments: this.hasMany(Comment, 'post_id')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      static fields () {
        return {
          id: this.attr(null),
          post_id: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: Post }, { model: Comment }])

    const state = {
      name: 'entities',
      posts: { data: {
        '1': { $id: 1, id: 1, title: 'Post Title', comments: [] }
      }},
      comments: { data: {
        '1': { $id: 1, id: 1, post_id: 1, body: 'Comment 01' },
        '2': { $id: 2, id: 2, post_id: 2, body: 'Comment 02' },
        '3': { $id: 3, id: 3, post_id: 1, body: 'Comment 03' }
      }}
    }

    const expected = {
      $id: 1,
      id: 1,
      title: 'Post Title',
      comments: [
        { $id: 1, id: 1, post_id: 1, body: 'Comment 01' },
        { $id: 3, id: 3, post_id: 1, body: 'Comment 03' }
      ]
    }

    const result = Repo.query(state, 'posts', false).with('comments').first()

    expect(result).toEqual(expected)
  })

  it('can resolve has many relation with custom primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'custom_id'

      static fields () {
        return {
          custom_id: this.attr(null),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: User }, { model: Post }])

    const state = {
      name: 'entities',
      users: { data: {
        '1': { $id: 1, custom_id: 1 }
      }},
      posts: { data: {
        '1': { $id: 1, id: 1, user_id: 2 },
        '2': { $id: 2, id: 2, user_id: 1 },
        '3': { $id: 3, id: 3, user_id: 1 }
      }}
    }

    const expected = {
      $id: 1,
      custom_id: 1,
      posts: [
        { $id: 2, id: 2, user_id: 1 },
        { $id: 3, id: 3, user_id: 1 }
      ]
    }

    const result = Repo.query(state, 'users', false).with('posts').first()

    expect(result).toEqual(expected)
  })
})
