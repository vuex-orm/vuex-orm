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

  it('can insert by action via insertOrUpdate', async () => {
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

    await store.dispatch('entities/insertOrUpdate', { entity: 'users', data })

    expect(store.state.entities.users.data[1].id).toBe(1)
    expect(store.state.entities.users.data[1].name).toBe('John Doe')
  })

  it('returns a newly created object when inserting data via insertOrUpdate', async () => {
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

    const user = await store.dispatch('entities/insertOrUpdate', { entity: 'users', data })

    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe('John Doe')
  })

  it('returns many newly created object when inserting multiple data via insertOrUpdate', async () => {
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

    const users = await store.dispatch('entities/insertOrUpdate', { entity: 'users', data })

    expect(users.length).toBe(3)
    expect(users[1]).toBeInstanceOf(User)
    expect(users[2].name).toBe('Johnny Doe')
  })

  it('returns only the newly created root entity when inserting data via insertOrUpdate', async () => {
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

    const user = await store.dispatch('entities/insertOrUpdate', { entity: 'users', data })

    expect(user).toBeInstanceOf(User)
    expect(user.posts).toEqual([])
  })

  it('can update by action via insertOrUpdate', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          role: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    const initialData = {
      id: 1,
      name: 'John Doe',
      role: 'admin'
    }

    await store.dispatch('entities/insertOrUpdate', { entity: 'users', data: initialData })

    const data = {
      id: 1,
      name: 'Johnny Doe'
    }

    await store.dispatch('entities/insertOrUpdate', { entity: 'users', data })

    expect(store.state.entities.users.data[1].id).toBe(1)
    expect(store.state.entities.users.data[1].name).toBe('Johnny Doe')
    expect(store.state.entities.users.data[1].role).toBe('admin')
  })

  it('returns a modified object when updating data via insertOrUpdate', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          role: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    const initialData = {
      id: 1,
      name: 'John Doe',
      role: 'admin'
    }

    await store.dispatch('entities/insertOrUpdate', { entity: 'users', data: initialData })

    const data = { id: 1, name: 'Johnny Doe' }

    const user = await store.dispatch('entities/insertOrUpdate', { entity: 'users', data })

    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe('Johnny Doe')
    expect(user.role).toBe('admin')
  })

  it('returns many new or modified objects when inserting multiple data via insertOrUpdate', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          role: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    const initialData = [
      { id: 1, name: 'John Doe', role: 'admin' },
      { id: 2, name: 'Jane Doe', role: 'user' }
    ]

    await store.dispatch('entities/insertOrUpdate', { entity: 'users', data: initialData })

    const data = [
      { id: 1, role: 'user' },
      { id: 2, role: 'admin' },
      { id: 3, name: 'Johnny Doe' }
    ]

    const users = await store.dispatch('entities/insertOrUpdate', { entity: 'users', data })

    expect(users.length).toBe(3)
    expect(users[1]).toBeInstanceOf(User)
    expect(users[0].name).toBe('John Doe')
    expect(users[0].role).toBe('user')
    expect(users[1].name).toBe('Jane Doe')
    expect(users[1].role).toBe('admin')
    expect(users[2].name).toBe('Johnny Doe')
    expect(users[2].role).toBe('')
  })

  it('returns only the created or modified root entity when using insertOrUpdate', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
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

    const initialData = {
      id: 1,
      name: 'John Doe',
      posts: [
        { id: 2, user_id: 1 },
        { id: 3, user_id: 1 }
      ]
    }

    await store.dispatch('entities/insertOrUpdate', { entity: 'users', data: initialData })

    const data = {
      id: 1,
      name: 'Johnny Doe'
    }

    const user = await store.dispatch('entities/insertOrUpdate', { entity: 'users', data })

    expect(user).toBeInstanceOf(User)
    expect(user.posts).toEqual([])
    expect(user.name).toEqual('Johnny Doe')
  })
})
