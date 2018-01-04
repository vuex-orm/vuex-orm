import { createStore } from 'test/support/Helpers'
import User from 'test/fixtures/models/User'
import Profile from 'test/fixtures/models/Profile'
import Post from 'test/fixtures/models/Post'
import Comment from 'test/fixtures/models/Comment'

const entities = [
  { model: User },
  { model: Profile },
  { model: Post },
  { model: Comment }
]

describe('Root modules', () => {
  it('can create data by action', async () => {
    const store = createStore(entities)

    const data = {
      id: 1,
      user_id: 2,
      user: { id: 2 }
    }

    await store.dispatch('entities/create', { entity: 'profiles', data })

    expect(store.state.entities.profiles.data[1].id).toBe(1)
    expect(store.state.entities.users.data[2].id).toBe(2)
  })

  it('can insert data by action', async () => {
    const store = createStore(entities)

    const data = {
      id: 1,
      user_id: 2,
      user: { id: 2 }
    }

    await store.dispatch('entities/insert', { entity: 'profiles', data })

    expect(store.state.entities.profiles.data[1].id).toBe(1)
    expect(store.state.entities.users.data[2].id).toBe(2)
  })

  it('can create a query by directly calling getter of the entity name', async () => {
    const store = createStore(entities)

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    const users = store.getters['entities/users']().get()

    expect(users.length).toBe(2)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[1]).toBeInstanceOf(User)
    expect(users[0].id).toBe(1)
    expect(users[1].id).toBe(2)

    const user = store.getters['entities/users']().first(1)

    expect(user.id).toBe(1)
  })

  it('can update data by action with id', async () => {
    const store = createStore(entities)

    const data = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Johnny' }
    ]

    await store.dispatch('entities/create', { entity: 'users', data })

    await store.dispatch('entities/update', {
      entity: 'users',
      data: { name: 'Christina' },
      where: 2
    })

    expect(store.state.entities.users.data[1].name).toBe('John')
    expect(store.state.entities.users.data[2].name).toBe('Christina')
  })

  it('can update data by action with closure', async () => {
    const store = createStore(entities)

    const data = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Johnny' }
    ]

    await store.dispatch('entities/create', { entity: 'users', data })

    await store.dispatch('entities/update', {
      entity: 'users',
      data: { name: 'Christina' },
      where (record) {
        return record.name === 'Jane'
      }
    })

    expect(store.state.entities.users.data[1].name).toBe('John')
    expect(store.state.entities.users.data[2].name).toBe('Christina')
  })

  it('can delete data by action', async () => {
    const store = createStore(entities)

    const data = [
      { id: 1 }, { id: 2 }, { id: 3 }
    ]

    await store.dispatch('entities/create', { entity: 'users', data })

    await store.dispatch('entities/delete', { entity: 'users', where: 2 })

    expect(store.getters['entities/users/all']().length).toBe(2)
    expect(store.state.entities.users.data[1].id).toBe(1)
    expect(store.state.entities.users.data[3].id).toBe(3)
  })

  it('can delete all data', async () => {
    const store = createStore(entities)

    const users = [
      { id: 1 }, { id: 2 }, { id: 3 }
    ]

    const posts = [
      { id: 1, user_id: 1 }, { id: 2, user_id: 2 }, { id: 3, user_id: 3 }
    ]

    await store.dispatch('entities/create', { entity: 'users', data: users })
    await store.dispatch('entities/create', { entity: 'posts', data: posts })

    await store.dispatch('entities/deleteAll')

    expect(store.getters['entities/users/all']().length).toBe(0)
    expect(store.getters['entities/posts/all']().length).toBe(0)
  })

  it('can delete all data when passing empty object', async () => {
    const store = createStore(entities)

    const users = [
      { id: 1 }, { id: 2 }, { id: 3 }
    ]

    const posts = [
      { id: 1, user_id: 1 }, { id: 2, user_id: 2 }, { id: 3, user_id: 3 }
    ]

    await store.dispatch('entities/create', { entity: 'users', data: users })
    await store.dispatch('entities/create', { entity: 'posts', data: posts })

    await store.dispatch('entities/deleteAll', {})

    expect(store.getters['entities/users/all']().length).toBe(0)
    expect(store.getters['entities/posts/all']().length).toBe(0)
  })
})
