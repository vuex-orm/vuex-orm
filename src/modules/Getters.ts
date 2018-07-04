import Item from '../data/Item'
import Collection from '../data/Collection'
import Query from '../query/Query'
import State from './contracts/State'
import RootState from './contracts/RootState'
import GettersContract from './contracts/Getters'

const Getters: GettersContract = {
  /**
   * Create a new Query instance.
   */
  query: (state: State, _getters: any, _rootState: RootState, rootGetters: any) => (wrap?: boolean): Query => {
    return rootGetters[`${state.$connection}/query`](state.$name, wrap)
  },

  /**
   * Get all data of given entity.
   */
  all: (state: State, _getters: any, _rootState: RootState, rootGetters: any) => (wrap?: boolean): Collection => {
    return rootGetters[`${state.$connection}/all`](state.$name, wrap)
  },

  /**
   * Find a data of the given entity by given id.
   */
  find: (state: State, _getters: any, _rootState: RootState, rootGetters: any) => (id: string | number, wrap?: boolean): Item => {
    return rootGetters[`${state.$connection}/find`](state.$name, id, wrap)
  }
}

export default Getters
