import Vuex from 'vuex'

export default {
  create ({ commit }, { data }) {
    commit('create', { data })
  }
} as Vuex.ActionTree<any, any>
