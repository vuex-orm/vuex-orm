import * as Vuex from 'vuex'
import EntityState from './EntityState'
import * as Paylods from './Payloads'

export type SubActions = Vuex.ActionTree<EntityState, any>

const subActions: SubActions = {
  /**
   * Save new data to the state. It will remove all existing data in the
   * state. If you want to keep existing data while saving new data,
   * use `insert` instead.
   */
  create ({ dispatch, state }, payload: Paylods.CreatePayload) {
    return dispatch(`${state.$connection}/create`, { entity: state.$name, ...payload }, { root: true })
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert ({ dispatch, state }, payload: Paylods.InsertPayload) {
    return dispatch(`${state.$connection}/insert`, { entity: state.$name, ...payload }, { root: true })
  },

  /**
   * Update data in the store.
   */
  update ({ dispatch, state }, payload: Paylods.UpdatePayload) {
    if (payload.data === undefined || Array.isArray(payload)) {
      return dispatch(`${state.$connection}/update`, { entity: state.$name, data: payload }, { root: true })
    }

    return dispatch(`${state.$connection}/update`, { entity: state.$name, ...payload }, { root: true })
  },

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  insertOrUpdate ({ dispatch, state }, payload: Paylods.InsertOrUpdatePayload) {
    return dispatch(`${state.$connection}/insertOrUpdate`, { entity: state.$name, ...payload }, { root: true })
  },

  /**
   * Delete data from the store.
   */
  delete ({ dispatch, state }, condition: Paylods.DeletePaylaod) {
    const where = typeof condition === 'object' ? condition.where : condition

    return dispatch(`${state.$connection}/delete`, { entity: state.$name, where }, { root: true })
  },

  /**
   * Delete all data from the store.
   */
  deleteAll ({ dispatch, state }) {
    dispatch(`${state.$connection}/deleteAll`, { entity: state.$name }, { root: true })
  }
}

export default subActions
