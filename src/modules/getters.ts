import Vuex from 'vuex'
import { Records } from '../Data'
import { State } from '../Module'
import Repo from '../Repo'

export default {
  /**
   * Get all data of given entity.
   */
  all: (state) => (entity: string, wrap: boolean = true): Records[] | null => {
    return Repo.all(state, entity, wrap)
  }
} as Vuex.GetterTree<State, any>
