import test from 'ava'
import * as Vuex from 'vuex'
import VuexORM from '../..'
import Database from '../../Database'
import User from '../fixtures/models/User'
import Profile from '../fixtures/models/Profile'
import Post from '../fixtures/models/Post'
import Comment from '../fixtures/models/Comment'

declare const require: any

const Vue = require('vue')

Vue.use(Vuex)

function createDatabase () {
  const database = new Database()

  database.register(User, {})
  database.register(Profile, {})
  database.register(Post, {})
  database.register(Comment, {})

  return database
}

function createStore () {
  return new Vuex.Store({
    plugins: [VuexORM(createDatabase())]
  })
}

test('Root module can create data by actions', async (t) => {
  const store = createStore()

  const data = {
    id: 1,
    user_id: 2,
    user: { id: 2 }
  }

  await store.dispatch('entities/create', { entity: 'profiles', data })

  t.is(store.state.entities.profiles.data[1].id, 1)
  t.is(store.state.entities.users.data[2].id, 2)
})
