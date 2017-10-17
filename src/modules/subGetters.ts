import * as Vuex from 'vuex'
import { EntityState } from '../Module'
import Repo, { Item, Collection } from '../Repo'

export default {
  /**
   * Create a new repo instance.
   */
  query: (state, _getters, _rootState, rootGetters) => (wrap: boolean = true): Repo => {
    return rootGetters[`${state.$connection}/query`](state.$name, wrap)
  },

  /**
   * Get all data of given entity.
   */
  all: (state, _getters, _rootState, rootGetters) => (wrap: boolean = true): Collection => {
    return rootGetters[`${state.$connection}/all`](state.$name, wrap)
  },

  /**
   * Find a data of the given entity by given id.
   */
  find: (state, _getters, _rootState, rootGetters) => (id: string | number, wrap: boolean = true): Item => {
    return rootGetters[`${state.$connection}/find`](state.$name, id, wrap)
  }
} as Vuex.GetterTree<any, EntityState>
