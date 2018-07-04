import * as Vuex from 'vuex'
import RootState from './RootState'

interface VuexModule extends Vuex.Module<RootState, any> {
  namespaced: boolean
  state: RootState
  getters: Vuex.GetterTree<RootState, any>
  actions: Vuex.ActionTree<RootState, any>
  mutations: Vuex.MutationTree<RootState>
  modules: Vuex.ModuleTree<any>
}

export default VuexModule
