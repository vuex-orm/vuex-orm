import Vuex from 'vuex'
import { State } from '../Module'
import Repo from '../Repo'

export default {
  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  create (state, { data }) {
    Repo.create(state, data)
  }
} as Vuex.MutationTree<State>
