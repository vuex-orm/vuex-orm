import * as Vuex from 'vuex'
import { EntityState } from '../Module'

export type SubActions = Vuex.ActionTree<EntityState, any>

const subActions: SubActions = {
  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  create ({ commit, state }, { data, createEntities, insertEntities }) {
    commit(`${state.$connection}/create`, { entity: state.$name, data, createEntities, insertEntities }, { root: true })
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert ({ commit, state }, { data, createEntities, insertEntities }) {
    commit(`${state.$connection}/insert`, { entity: state.$name, data, createEntities, insertEntities }, { root: true })
  },

  /**
   * Update data in the store.
   */
  update ({ commit, state }, payload) {
    const where = payload.where
    const data = payload.data

    if (where === undefined || data === undefined) {
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
