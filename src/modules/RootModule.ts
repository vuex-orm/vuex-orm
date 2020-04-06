import { Module as BaseModule, ModuleTree } from 'vuex'
import RootState from './RootState'

export default interface RootModule<S = RootState, R = any>
  extends BaseModule<S, R> {
  namespaced: true
  modules: ModuleTree<R>
}
