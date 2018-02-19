import * as Vuex from 'vuex'
import { EntityState } from './Module'

export type SubActions = Vuex.ActionTree<EntityState, any>

const subActions: SubActions = {
  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  async create ({ dispatch, state }, { data, insert }) {
    return dispatch(`${state.$connection}/create`, { entity: state.$name, data, insert }, { root: true })
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  async insert ({ dispatch, state }, { data, create }) {
    return dispatch(`${state.$connection}/insert`, { entity: state.$name, data, create }, { root: true })
  },

  /**
   * Update data in the store.
   */
  update ({ dispatch, state }, payload) {
    const where = payload.where
    const data = payload.data

    if (where === undefined || data === undefined) {
      return dispatch(`${state.$connection}/update`, { entity: state.$name, data: payload }, { root: true })
    }

    return dispatch(`${state.$connection}/update`, { entity: state.$name, where, data }, { root: true })
  },

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  async insertOrUpdate ({ dispatch, state }, { data, create }) {
    return dispatch(`${state.$connection}/insertOrUpdate`, { entity: state.$name, data, create }, { root: true })
  },

  /**
   * Delete data from the store.
   */
  delete ({ commit, state }, condition) {
    commit(`${state.$connection}/delete`, {
      entity: state.$name,
      where: typeof condition === 'object' ? condition.where : condition
    }, { root: true })
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
