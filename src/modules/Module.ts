import { Module as BaseModule } from 'vuex'
import { State } from './State'
import { Mutations } from './Mutations'

export interface Module<S extends State, R> extends BaseModule<S, R> {
  namespaced: true
  state: S
  mutations: Mutations<S>
}
