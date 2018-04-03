import * as Vuex from 'vuex'
import Query from '../query/Query'
import State from './State'

export type Mutations = Vuex.MutationTree<State>

const mutations: Mutations = {
  /**
   * Save new data to the state. It will remove all existing data in the
   * state. If you want to keep existing data while saving new data,
   * use `insert` instead.
   */
  create (state: State, { entity, data, create, insert, update, insertOrUpdate }) {
    Query.create(state, entity, data, { create, insert, update, insertOrUpdate })
  },

  /**
   * Commit `create` to the state.
   */
  commitCreate (state: State, { entity, data }) {
    Query.commitCreate(state, entity, data)
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert (state: State, { entity, data, create, insert, update, insertOrUpdate }) {
    Query.insert(state, entity, data, { create, insert, update, insertOrUpdate })
  },

  /**
   * Commit `insert` to the state.
   */
  commitInsert (state: State, { entity, data }) {
    Query.commitInsert(state, entity, data)
  },

  /**
   * Update data in the store.
   */
  update (state: State, { entity, data, where, create, insert, update, insertOrUpdate }) {
    Query.update(state, entity, data, where, { create, insert, update, insertOrUpdate })
  },

  /**
   * Commit `create` to the state.
   */
  commitUpdate (state: State, { entity, data }) {
    Query.commitUpdate(state, entity, data)
  },

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  insertOrUpdate (state: State, { entity, data, create }) {
    Query.insertOrUpdate(state, entity, data, create)
  },

  /**
   * Delete data from the store.
   */
  delete (state: State, { entity, where }) {
    Query.delete(state, entity, where)
  },

  /**
   * Delete all data from the store.
   */
  deleteAll (state, payload?) {
    if (payload && payload.entity) {
      Query.deleteAll(state, payload.entity)

      return
    }

    Query.deleteAll(state)
  },

  /**
   * Commit `delete` to the state.
   */
  commitDelete (state: State, { entity, ids }) {
    Query.commitDelete(state, entity, ids)
  }
}

export default mutations
