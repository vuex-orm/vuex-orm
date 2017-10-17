import * as Vuex from 'vuex'
import { EntityState } from '../Module'

export default {
  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  create ({ commit, state }, { data }) {
    commit(`${state.$connection}/create`, { entity: state.$name, data }, { root: true })
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert ({ commit, state }, { data }) {
    commit(`${state.$connection}/insert`, { entity: state.$name, data }, { root: true })
  }
} as Vuex.ActionTree<EntityState, any>
