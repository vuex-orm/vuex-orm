import * as Vuex from 'vuex'
import { State } from '../Module'

export type RootActions = Vuex.ActionTree<State, any>

const rootActions: RootActions = {
  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  create ({ commit }, { entity, data, createEntities = [], insertEntities = [] }) {
    commit('create', { entity, data, createEntities, insertEntities })
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert ({ commit }, { entity, data, createEntities = [], insertEntities = [] }) {
    commit('insert', { entity, data, createEntities, insertEntities })
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
  },

  /**
   * Delete all data from the store.
   *
   * @param {object} payload If exists, it should contain `entity`.
   */
  deleteAll ({ commit }, payload?) {
    commit('deleteAll', payload)
  }
}

export default rootActions
