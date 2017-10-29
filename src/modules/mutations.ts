import * as Vuex from 'vuex'
import { State } from '../Module'
import Repo from '../Repo'

export default {
  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  create (state, { entity, data }) {
    Repo.create(state, entity, data)
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert (state, { entity, data }) {
    Repo.insert(state, entity, data)
  },

  /**
   * Delete data from the store.
   */
  delete (state, { entity, where }) {
    Repo.delete(state, entity, where)
  }
} as Vuex.MutationTree<State>
