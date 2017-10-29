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
  },

  /**
   * Update data in the store.
   */
  update ({ commit, state }, payload) {
    let where = payload.where
    let data = payload.data

    if (where === undefined && data === undefined) {
      commit(`${state.$connection}/update`, { entity: state.$name, data: payload }, { root: true })

      return
    }

    if (typeof data !== 'object') {
      commit(`${state.$connection}/update`, { entity: state.$name, data: payload }, { root: true })

      return
    }

    commit(`${state.$connection}/update`, { entity: state.$name, where, data }, { root: true })
  },

  /**
   * Delete data from the store.
   */
  delete ({ commit, state }, condition) {
    commit(`${state.$connection}/delete`, {
      entity: state.$name,
      where: typeof condition === 'object' ? condition.where : condition
    }, { root: true })
  }
} as Vuex.ActionTree<EntityState, any>
