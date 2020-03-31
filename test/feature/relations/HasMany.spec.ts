import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Features – Relations – Has Many', () => {
  class User extends Model {
    static entity = 'users'

    static fields() {
      return {
        id: this.attr(null),
        posts: this.hasMany(Post, 'user_id')
      }
    }
  }

  class Post extends Model {
    static entity = 'posts'

    static fields() {
      return {
        id: this.attr(null),
        user_id: this.attr(null)
      }
    }
  }

  it('can create data containing the has many relation', async () => {
    createStore([{ model: User }, { model: Post }])

    await User.create({
      id: 1,
      posts: [{ id: 1 }, { id: 2 }]
    })

    const expectedUsers = [{ $id: '1', id: 1, posts: [] }]

    expect(User.all()).toEqual(expectedUsers)

    const expectedPosts = [
      { $id: '1', id: 1, user_id: 1 },
      { $id: '2', id: 2, user_id: 1 }
    ]

    expect(Post.all()).toEqual(expectedPosts)
  })

  it('can update data and insert has many relation', async () => {
    createStore([{ model: User }, { model: Post }])

    await User.create({ id: 1 })

    await User.update(
      {
        id: 1,
        posts: [{ id: 1 }, { id: 2 }]
      },
      {
        insert: ['posts']
      }
    )

    const expectedUsers = [{ $id: '1', id: 1, posts: [] }]

    expect(User.all()).toEqual(expectedUsers)

    const expectedPosts = [
      { $id: '1', id: 1, user_id: 1 },
      { $id: '2', id: 2, user_id: 1 }
    ]

    expect(Post.all()).toEqual(expectedPosts)
  })

  it('can resolve the has many relation', async () => {
    createStore([{ model: User }, { model: Post }])

    await User.create([
      {
        id: 1,
        posts: [{ id: 1 }, { id: 2 }]
      },
      {
        id: 2,
        posts: null
      }
    ])

    const expected = [
      {
        $id: '1',
        id: 1,
        posts: [
          { $id: '1', id: 1, user_id: 1 },
          { $id: '2', id: 2, user_id: 1 }
        ]
      },
      {
        $id: '2',
        id: 2,
        posts: []
      }
    ]

    const user = User.query()
      .with('posts')
      .all()

    expect(user).toEqual(expected)
  })

  it('can resolve the has many relation with custom primary key', async () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'user_id'

      static fields() {
        return {
          user_id: this.attr(null),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    createStore([{ model: User }, { model: Post }])

    await User.create({
      user_id: 1,
      posts: [{ id: 1 }, { id: 2 }]
    })

    const expected = {
      $id: '1',
      user_id: 1,
      posts: [
        { $id: '1', id: 1, user_id: 1 },
        { $id: '2', id: 2, user_id: 1 }
      ]
    }

    const user = User.query()
      .with('posts')
      .find(1)

    expect(user).toEqual(expected)
  })

  it('can resolve the has many using the local key', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          local_key: this.attr(null),
          posts: this.hasMany(Post, 'user_id', 'local_key')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields() {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    createStore([{ model: User }, { model: Post }])

    await User.create({
      id: 1,
      local_key: 'local_key',
      posts: [{ id: 1 }]
    })

    const expectedUsers = [
      { $id: '1', id: 1, local_key: 'local_key', posts: [] }
    ]

    expect(User.all()).toEqual(expectedUsers)

    const expectedPosts = [{ $id: '1', id: 1, user_id: 'local_key' }]

    expect(Post.all()).toEqual(expectedPosts)
  })
})
