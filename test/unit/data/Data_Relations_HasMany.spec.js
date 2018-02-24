import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Repo from 'app/repo/Repo'
import Data from 'app/data/Data'

describe('Data – Relations – Has Many', () => {
  it('can normalize the has many relation', () => {
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

    const store = createStore([{ model: User }, { model: Post }])

    const repo = new Repo(store.state.entities, 'users')

    const data = {
      id: 1,
      posts: [
        { id: 1, user_id: 1 },
        { id: 2, user_id: 1 }
      ]
    }

    const expected = {
      users: {
        '1': { $id: 1, id: 1, posts: [1, 2] }
      },
      posts: {
        '1': { $id: 1, id: 1, user_id: 1 },
        '2': { $id: 2, id: 2, user_id: 1 }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can normalize list of has many relation', () => {
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

    const store = createStore([{ model: User }, { model: Post }])

    const repo = new Repo(store.state.entities, 'users')

    const data = [
      {
        id: 1,
        posts: [
          { id: 1, user_id: 1 },
          { id: 2, user_id: 1 }
        ]
      },
      {
        id: 2,
        posts: [
          { id: 3, user_id: 2 },
          { id: 4, user_id: 2 }
        ]
      }
    ]

    const expected = {
      users: {
        '1': { $id: 1, id: 1, posts: [1, 2] },
        '2': { $id: 2, id: 2, posts: [3, 4] }
      },
      posts: {
        '1': { $id: 1, id: 1, user_id: 1 },
        '2': { $id: 2, id: 2, user_id: 1 },
        '3': { $id: 3, id: 3, user_id: 2 },
        '4': { $id: 4, id: 4, user_id: 2 }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can generate relation field', () => {
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

    const store = createStore([{ model: User }, { model: Post }])

    const repo = new Repo(store.state.entities, 'users')

    const data = {
      id: 1,
      posts: [
        { id: 1 },
        { id: 2 }
      ]
    }

    const expected = {
      users: {
        '1': { $id: 1, id: 1, posts: [1, 2] }
      },
      posts: {
        '1': { $id: 1, id: 1, user_id: 1 },
        '2': { $id: 2, id: 2, user_id: 1 }
      }
    }

    const normalizedData = Data.normalize(data, repo)

    expect(Data.fill(normalizedData, repo)).toEqual(expected)
  })
})
