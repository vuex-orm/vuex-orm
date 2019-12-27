import Item from '../data/Item'
import Collection from '../data/Collection'
import Query from '../query/Query'
import State from './contracts/State'
import RootState from './contracts/RootState'
import GettersContract from './contracts/Getters'

/**
 * Create a new Query instance.
 */
const query = (state: State, _getters: any, _rootState: RootState, rootGetters: any) => (): Query => {
  return rootGetters[`${state.$connection}/query`](state.$name)
}

/**
 * Get all data of given entity.
 */
const all = (state: State, _getters: any, _rootState: RootState, rootGetters: any) => (): Collection => {
  return rootGetters[`${state.$connection}/all`](state.$name)
}

/**
 * Find a data of the given entity by given id.
 */
const find = (state: State, _getters: any, _rootState: RootState, rootGetters: any) => (id: string | number | (number | string)[]): Item => {
  return rootGetters[`${state.$connection}/find`](state.$name, id)
}

/**
 * Find array of data of the given entity by given ids.
 */
const findIn = (state: State, _getters: any, _rootState: RootState, rootGetters: any) => (idList: Array<string | number | (number | string)[]>): Collection => {
  return rootGetters[`${state.$connection}/findIn`](state.$name, idList)
}

const Getters: GettersContract = {
  query,
  all,
  find,
  findIn
}

export default Getters
