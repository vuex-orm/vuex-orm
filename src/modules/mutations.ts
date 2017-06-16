import Vuex from 'vuex'
import Model from '../Model'
import { State } from './state'

/**
 * Returns the Vuex Mutations.
 */
export default function mutations (model: typeof Model): Vuex.MutationTree<State> {
  return {
    /**
     * Create entities in the Vuex Store
     */
    make (_state, { data, rootState }) {
      model.saveToStore(rootState, data)
    }
  }
}
