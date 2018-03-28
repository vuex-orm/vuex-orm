import * as Vuex from 'vuex'
import State from './State'

export type RootActions = Vuex.ActionTree<State, any>

const rootActions: RootActions = {
  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  create ({ commit }, { entity, data, insert }): Promise<any> {
    return new Promise((resolve) => {
      commit('create', { entity, data, insert, done: resolve })
    })
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert ({ commit }, { entity, data, create }): Promise<any> {
    return new Promise((resolve) => {
      commit('insert', { entity, data, create, done: resolve })
    })
  },

  /**
   * Update data in the store.
   */
  update ({ commit }, { entity, where, data }): Promise<any> {
    return new Promise((resolve) => {
      commit('update', { entity, where, data, done: resolve })
    })
  },

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  insertOrUpdate ({ commit }, { entity, data, create }): Promise<any> {
    return new Promise((resolve) => {
      commit('insertOrUpdate', { entity, data, create, done: resolve })
    })
  },

  /**
   * Delete data from the store.
   */
  delete ({ commit }, { entity, where }): void {
    commit('delete', { entity, where })
  },

  /**
   * Delete all data from the store.
   *
   * @param {object} payload If exists, it should contain `entity`.
   */
  deleteAll ({ commit }, payload?): void {
    commit('deleteAll', payload)
  }
}

export default rootActions
