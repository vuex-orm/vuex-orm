import * as Vuex from 'vuex'
import { State } from './Module'
import Repo, { Item, Collection } from '../repo/Repo'

export type RootGetters = Vuex.GetterTree<State, any>

const rootGetters: RootGetters = {
  /**
   * Create a new repo instance.
   */
  query: (state) => (entity: string, wrap: boolean = true): Repo => {
    return Repo.query(state, entity, wrap)
  },

  /**
   * Get all data of given entity.
   */
  all: (state) => (entity: string, wrap: boolean = true): Collection => {
    return Repo.all(state, entity, wrap)
  },

  /**
   * Find a data of the given entity by given id.
   */
  find: (state) => (entity: string, id: string | number, wrap: boolean = true): Item => {
    return Repo.find(state, entity, id, wrap)
  }
}

export default rootGetters
