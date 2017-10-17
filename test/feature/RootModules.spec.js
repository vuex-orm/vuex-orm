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
})
