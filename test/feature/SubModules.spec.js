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

describe('Sub Modules', () => {
  it('can find a data by getter', async () => {
    const store = createStore(entities)

    const data = {
      id: 1,
      user_id: 2,
      user: { id: 2 }
    }

    await store.dispatch('entities/profiles/create', { data })

    const profile = store.getters['entities/profiles/find'](1)

    expect(profile).toBeInstanceOf(Profile)
    expect(profile.id).toBe(1)
  })

  it('can find all data by getter', async () => {
    const store = createStore(entities)

    const data = [
      { id: 1, user_id: 1 },
      { id: 2, user_id: 2 }
    ]

    await store.dispatch('entities/profiles/create', { data })

    const profiles = store.getters['entities/profiles/all']()

    expect(profiles[0]).toBeInstanceOf(Profile)
    expect(profiles.length).toBe(2)
    expect(profiles[0].id).toBe(1)
    expect(profiles[1].id).toBe(2)
  })

  it('can create a query by getter', async () => {
    const store = createStore(entities)

    const data = {
      id: 1,
      user_id: 2,
      user: { id: 2 }
    }

    await store.dispatch('entities/profiles/create', { data })

    const profile = store.getters['entities/profiles/query']().with('user').first()

    expect(profile).toBeInstanceOf(Profile)
    expect(profile.user).toBeInstanceOf(User)
    expect(profile.id).toBe(1)
    expect(profile.user.id).toBe(2)
  })

  it('can update data by action when containing primary key in the data', async () => {
    const store = createStore(entities)

    const data = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Johnny' }
    ]

    await store.dispatch('entities/create', { entity: 'users', data })

    await store.dispatch('entities/users/update', { id: 2, name: 'Christina' })

    expect(store.state.entities.users.data[1].name).toBe('John')
    expect(store.state.entities.users.data[2].name).toBe('Christina')
  })

  it('can update data by action with id', async () => {
    const store = createStore(entities)

    const data = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Johnny' }
    ]

    await store.dispatch('entities/create', { entity: 'users', data })

    await store.dispatch('entities/users/update', {
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

    await store.dispatch('entities/users/update', {
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

    await store.dispatch('entities/users/create', { data })

    await store.dispatch('entities/users/delete', { where: 2 })

    expect(store.getters['entities/users/all']().length).toBe(2)
    expect(store.state.entities.users.data[1].id).toBe(1)
    expect(store.state.entities.users.data[3].id).toBe(3)
  })

  it('can delete data by action with direct argument', async () => {
    const store = createStore(entities)

    const data = [
      { id: 1 }, { id: 2 }, { id: 3 }
    ]

    await store.dispatch('entities/users/create', { data })

    await store.dispatch('entities/users/delete', record => record.id === 2)

    expect(store.getters['entities/users/all']().length).toBe(2)
    expect(store.state.entities.users.data[1].id).toBe(1)
    expect(store.state.entities.users.data[3].id).toBe(3)
  })

  it('can delete all data', async () => {
    const store = createStore(entities)

    const data = [
      { id: 1 }, { id: 2 }, { id: 3 }
    ]

    await store.dispatch('entities/users/create', { data })

    await store.dispatch('entities/users/deleteAll')

    expect(store.getters['entities/users/all']().length).toBe(0)
  })
})
