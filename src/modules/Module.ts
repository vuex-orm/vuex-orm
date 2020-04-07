import { Module as BaseModule } from 'vuex'
import State from './State'

export default interface Module<S extends State, R> extends BaseModule<S, R> {
  namespaced: true
  state: S
}
