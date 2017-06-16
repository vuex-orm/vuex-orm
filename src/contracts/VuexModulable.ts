import Vuex from 'vuex'

abstract class VuexModulable {
  static state: () => { [key: string]: any }

  static actions: () => Vuex.ActionTree<any, any>

  static mutations: () => Vuex.MutationTree<any>
}

export default VuexModulable
