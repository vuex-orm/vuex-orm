import { createStore } from 'test/support/Helpers'
import Model from 'app/Model'

describe('Root Modules – Inserts', () => {
  it('can create data by action', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    const data = {
      id: 1,
      name: 'John Doe'
    }

    await store.dispatch('entities/create', { entity: 'users', data })

    expect(store.state.entities.users.data[1].id).toBe(1)
    expect(store.state.entities.users.data[1].name).toBe('John Doe')
  })

  it('returns a newly created object when creating data', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    const data = { id: 1, name: 'John Doe' }

    const user = await store.dispatch('entities/create', { entity: 'users', data })

    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe('John Doe')
  })

  it('returns many newly created object when creating multiple data', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    const data = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' }
    ]

    const users = await store.dispatch('entities/create', { entity: 'users', data })

    expect(users.length).toBe(3)
    expect(users[1]).toBeInstanceOf(User)
    expect(users[2].name).toBe('Johnny Doe')
  })

  it('returns only the newly created root entity when creating data', async () => {
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
          user_id: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }])

    const data = {
      id: 1,
      posts: [
        { id: 2, user_id: 1 },
        { id: 3, user_id: 1 }
      ]
    }

    const user = await store.dispatch('entities/create', { entity: 'users', data })

    expect(user).toBeInstanceOf(User)
    expect(user.posts).toEqual([])
  })

  it('can insert data by action', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    const data = {
      id: 1,
      name: 'John Doe'
    }

    await store.dispatch('entities/insert', { entity: 'users', data })

    expect(store.state.entities.users.data[1].id).toBe(1)
    expect(store.state.entities.users.data[1].name).toBe('John Doe')
  })

  it('returns a newly created object when inserting data', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    const data = { id: 1, name: 'John Doe' }

    const user = await store.dispatch('entities/insert', { entity: 'users', data })

    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe('John Doe')
  })

  it('returns many newly created object when inserting multiple data', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    const data = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' }
    ]

    const users = await store.dispatch('entities/insert', { entity: 'users', data })

    expect(users.length).toBe(3)
    expect(users[1]).toBeInstanceOf(User)
    expect(users[2].name).toBe('Johnny Doe')
  })

  it('returns only the newly created root entity when inserting data', async () => {
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
          user_id: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }, { model: Post }])

    const data = {
      id: 1,
      posts: [
        { id: 2, user_id: 1 },
        { id: 3, user_id: 1 }
      ]
    }

    const user = await store.dispatch('entities/insert', { entity: 'users', data })

    expect(user).toBeInstanceOf(User)
    expect(user.posts).toEqual([])
  })
})
