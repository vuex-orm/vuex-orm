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
})
