import * as Vuex from 'vuex'

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
  },

  /**
   * Update data in the store.
   */
  update ({ commit }, { entity, where, data }) {
    commit('update', { entity, where, data })
  },

  /**
   * Delete data from the store.
   */
  delete ({ commit }, { entity, where }) {
    commit('delete', { entity, where })
  }
} as Vuex.ActionTree<any, any>
