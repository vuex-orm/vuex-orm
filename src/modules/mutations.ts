import * as Vuex from 'vuex'
import State from './State'
import Query from '../query/Query'

export type Mutations = Vuex.MutationTree<State>

const mutations: Mutations = {
  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  create (state, { entity, data, insert, done }) {
    const result = Query.create(state, entity, data, insert)

    done && done(result)
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert (state, { entity, data, create, done }) {
    const result = Query.insert(state, entity, data, create)

    done && done(result)
  },

  /**
   * Update data in the store.
   */
  update (state, { entity, where, data, done }) {
    const result = Query.update(state, entity, data, where)

    done && done(result)
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
   *
   * @param {object} payload If exists, it should contain `entity`.
   */
  deleteAll (state, payload?) {
    if (payload && payload.entity) {
      Query.deleteAll(state, payload.entity)

      return
    }

    Query.deleteAll(state)
  }
}

export default mutations
