import Vuex from 'vuex'

export default {
  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  create ({ commit }, { entity, data }) {
    commit('create', { entity, data })
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert ({ commit }, { entity, data }) {
    commit('insert', { entity, data })
  }
} as Vuex.ActionTree<any, any>
