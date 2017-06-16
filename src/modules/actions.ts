import Vuex from 'vuex'
import ModelClass from '../Model'

/**
 * Returns the Vuex Actions.
 */
export default function actions (Model: typeof ModelClass): Vuex.ActionTree<any, any> {
  return {
    /**
     * Create entities in the Vuex Store
     */
    make ({ commit }, { data }) {
      return Model.saveToStore(commit, data)
    }
  }
}
