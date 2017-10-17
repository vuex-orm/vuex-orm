import test from 'ava'
import { createStore } from '../support/Helpers'
import User from '../fixtures/models/User'
import Profile from '../fixtures/models/Profile'
import Post from '../fixtures/models/Post'
import Comment from '../fixtures/models/Comment'

const entities = [
  { model: User },
  { model: Profile },
  { model: Post },
  { model: Comment }
]

test('Root module can create data by action', async (t) => {
  const store = createStore(entities)

  const data = {
    id: 1,
    user_id: 2,
    user: { id: 2 }
  }

  await store.dispatch('entities/create', { entity: 'profiles', data })

  t.is(store.state.entities.profiles.data[1].id, 1)
  t.is(store.state.entities.users.data[2].id, 2)
})

test('Root module can insert data by action', async (t) => {
  const store = createStore(entities)

  const data = {
    id: 1,
    user_id: 2,
    user: { id: 2 }
  }

  await store.dispatch('entities/insert', { entity: 'profiles', data })

  t.is(store.state.entities.profiles.data[1].id, 1)
  t.is(store.state.entities.users.data[2].id, 2)
})
