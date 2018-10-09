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
  query: (state: State, _getters: any, _rootState: RootState, rootGetters: any) => (): Query => {
    return rootGetters[`${state.$connection}/query`](state.$name)
  },

  /**
   * Get all data of given entity.
   */
  all: (state: State, _getters: any, _rootState: RootState, rootGetters: any) => (): Collection => {
    return rootGetters[`${state.$connection}/all`](state.$name)
  },

  /**
   * Find a data of the given entity by given id.
   */
  find: (state: State, _getters: any, _rootState: RootState, rootGetters: any) => (id: string | number): Item => {
    return rootGetters[`${state.$connection}/find`](state.$name, id)
  }
}

export default Getters
