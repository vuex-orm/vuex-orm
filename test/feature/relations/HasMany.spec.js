import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Relations – Has Many', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
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

  it('can create data containing the has many relation', () => {
    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/users/create', {
      data: {
        id: 1,
        posts: [
          { id: 1 },
          { id: 2 }
        ]
      }
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, posts: [] }
      },
      posts: {
        '1': { $id: 1, id: 1, user_id: 1 },
        '2': { $id: 2, id: 2, user_id: 1 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can update data and insert has many relation', () => {
    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/users/create', {
      data: { id: 1 }
    })

    store.dispatch('entities/users/update', {
      where: 1,
      insert: ['posts'],
      data: {
        posts: [
          { id: 1 },
          { id: 2 }
        ]
      }
    })

    const expected = createState({
      users: {
        '1': { $id: 1, id: 1, posts: [] }
      },
      posts: {
        '1': { $id: 1, id: 1, user_id: 1 },
        '2': { $id: 2, id: 2, user_id: 1 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can resolve the has many relation', () => {
    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/users/create', {
      data: [
        {
          id: 1,
          posts: [
            { id: 1 },
            { id: 2 }
          ]
        },
        {
          id: 2,
          posts: null
        }
      ]
    })

    const expected = [
      {
        $id: 1,
        id: 1,
        posts: [
          { $id: 1, id: 1, user_id: 1 },
          { $id: 2, id: 2, user_id: 1 }
        ]
      },
      {
        $id: 2,
        id: 2,
        posts: []
      }
    ]

    const user = store.getters['entities/users/query']().with('posts').all()

    expect(user).toEqual(expected)
  })

  it('can resolve the has many relation with custom primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'user_id'

      static fields () {
        return {
          user_id: this.attr(null),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }])

    store.dispatch('entities/users/create', {
      data: {
        user_id: 1,
        posts: [
          { id: 1 },
          { id: 2 }
        ]
      }
    })

    const expected = {
      $id: 1,
      user_id: 1,
      posts: [
        { $id: 1, id: 1, user_id: 1 },
        { $id: 2, id: 2, user_id: 1 }
      ]
    }

    const user = store.getters['entities/users/query']().with('posts').find(1)

    expect(user).toEqual(expected)
  })
})
