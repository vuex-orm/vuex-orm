import * as Vuex from 'vuex'
import EntityState from './EntityState'

export type SubActions = Vuex.ActionTree<EntityState, any>

const subActions: SubActions = {
  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  create ({ dispatch, state }, payload) {
    return dispatch(`${state.$connection}/create`, { entity: state.$name, ...payload }, { root: true })
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert ({ dispatch, state }, payload) {
    return dispatch(`${state.$connection}/insert`, { entity: state.$name, ...payload }, { root: true })
  },

  /**
   * Update data in the store.
   */
  update ({ dispatch, state }, payload) {
    const { where, data } = payload

    if (where === undefined || data === undefined) {
      return dispatch(`${state.$connection}/update`, { entity: state.$name, data: payload }, { root: true })
    }

    return dispatch(`${state.$connection}/update`, { entity: state.$name, ...payload }, { root: true })
  },

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  insertOrUpdate ({ dispatch, state }, payload) {
    return dispatch(`${state.$connection}/insertOrUpdate`, { entity: state.$name, ...payload }, { root: true })
  },

  /**
   * Delete data from the store.
   */
  delete ({ dispatch, state }, condition) {
    const where = typeof condition === 'object' ? condition.where : condition

    return dispatch(`${state.$connection}/insertOrUpdate`, { entity: state.$name, where }, { root: true })
  },

  /**
   * Delete all data from the store.
   */
  deleteAll ({ commit, state }) {
    commit(`${state.$connection}/deleteAll`, {
      entity: state.$name
    }, { root: true })
  }
}

export default subActions
