import * as Vuex from 'vuex'
import State from './State'
import Query from '../query/Query'

export type Mutations = Vuex.MutationTree<State>

const mutations: Mutations = {
  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  create (state, { entity, data, create, insert, update, insertOrUpdate }) {
    Query.create(state, entity, data, { create, insert, update, insertOrUpdate })
  },

  /**
   * Commit `create` to the state.
   */
  commitCreate (state, { entity, data }) {
    Query.commitCreate(state, entity, data)
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert (state, { entity, data, create, insert, update, insertOrUpdate }) {
    Query.insert(state, entity, data, { create, insert, update, insertOrUpdate })
  },

  /**
   * Commit `insert` to the state.
   */
  commitInsert (state, { entity, data }) {
    Query.commitInsert(state, entity, data)
  },

  /**
   * Update data in the store.
   */
  update (state, { entity, data, where, create, insert, update, insertOrUpdate }) {
    Query.update(state, entity, data, where, { create, insert, update, insertOrUpdate })
  },

  /**
   * Commit `create` to the state.
   */
  commitUpdate (state, { entity, data }) {
    Query.commitUpdate(state, entity, data)
  },

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  insertOrUpdate (state, { entity, data, create, done }) {
    const result = Query.insertOrUpdate(state, entity, data, create)

    done && done(result)
  },

  /**
   * Delete data from the store.
   */
  delete (state, { entity, where }) {
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
  commitDelete (state, { entity, ids }): void {
    Query.commitDelete(state, entity, ids)
  }
}

export default mutations
