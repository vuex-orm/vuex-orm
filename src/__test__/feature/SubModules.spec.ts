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

test('Sub module can create data by action', async (t) => {
  const store = createStore(entities)

  const data = {
    id: 1,
    user_id: 2,
    user: { id: 2 }
  }

  await store.dispatch('entities/profiles/create', { data })

  t.is(store.state.entities.profiles.data[1].id, 1)
  t.is(store.state.entities.users.data[2].id, 2)
})

test('Sub module can insert data by action', async (t) => {
  const store = createStore(entities)

  const data = {
    id: 1,
    user_id: 2,
    user: { id: 2 }
  }

  await store.dispatch('entities/profiles/insert', { data })

  t.is(store.state.entities.profiles.data[1].id, 1)
  t.is(store.state.entities.users.data[2].id, 2)
})

test('Sub module can find a data by getter', async (t) => {
  const store = createStore(entities)

  const data = {
    id: 1,
    user_id: 2,
    user: { id: 2 }
  }

  await store.dispatch('entities/profiles/create', { data })

  const profile = store.getters['entities/profiles/find'](1)

  t.true(profile instanceof Profile)
  t.is(profile.id, 1)
})

test('Sub module can find all data by getter', async (t) => {
  const store = createStore(entities)

  const data = [
    { id: 1, user_id: 1 },
    { id: 2, user_id: 2 },
  ]

  await store.dispatch('entities/profiles/create', { data })

  const profiles = store.getters['entities/profiles/all']()

  t.true(profiles[0] instanceof Profile)
  t.is(profiles.length, 2)
  t.is(profiles[0].id, 1)
  t.is(profiles[1].id, 2)
})

test('Sub module can create a query by getter', async (t) => {
  const store = createStore(entities)

  const data = {
    id: 1,
    user_id: 2,
    user: { id: 2 }
  }

  await store.dispatch('entities/profiles/create', { data })

  const profile = store.getters['entities/profiles/query']().with('user').first()

  t.true(profile instanceof Profile)
  t.true(profile.user instanceof User)
  t.is(profile.id, 1)
  t.is(profile.user.id, 2)
})
