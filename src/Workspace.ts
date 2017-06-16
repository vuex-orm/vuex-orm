import Vuex from 'vuex'
import VuexModulable from './contracts/VuexModulable'
import Model from './Model'

export interface State {
  data: Model | null
}

export default class Workspace implements VuexModulable {
  /**
   * The entity that this workspace belongs to.
   */
  static Entity: typeof Model

  /**
   * Define state of the workspace.
   */
  static state (): State {
    return {
      data: null
    }
  }

  /**
   * Define actions of the workspace.
   */
  static actions (): Vuex.ActionTree<any, any> {
    return {
      make ({ commit }, { data = {}, full = true }) {
        commit('make', { data, full })
      }
    }
  }

  /**
   * Define mutations of the workspace.
   */
  static mutations (): Vuex.MutationTree<any> {
    const that = this

    return {
      make (state, { data = {}, full = true }) {
        state.data = new that.Entity(data, full)
      }
    }
  }
}
