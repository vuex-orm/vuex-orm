import { Module as BaseModule } from 'vuex'
import State from './State'

export default interface Module<S = State, R = any> extends BaseModule<S, R> {
  namespaced: true
  state: S
}
