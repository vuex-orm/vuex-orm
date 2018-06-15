import * as Vuex from 'vuex'
import Utils from '../support/Utils'
import Modules from '../database/Modules'
import EntityState from './EntityState'
import rootGetters from './rootGetters'
import rootActions from './rootActions'
import mutations from './mutations'
import subGetters from './subGetters'
import subActions from './subActions'

interface VuexModule<S, R> extends Vuex.Module<S, R> {
  namespaced: boolean
  state: S
  getters: Vuex.GetterTree<S, R>
  actions: Vuex.ActionTree<S, R>
  mutations: Vuex.MutationTree<S>
  modules: Vuex.ModuleTree<R>
}

export default class Module {
  /**
   * The default state. This state will be merged with additional
   * entity's state if it has any.
   */
  static state (): EntityState {
    return {
      $connection: '',
      $name: '',
      data: {}
    }
  }

  /**
   * Create module from the given entities.
   */
  static create (namespace: string, modules: Modules): Vuex.Module<any, any> {
    const tree: VuexModule<any, any> = {
      namespaced: true,
      state: { $name: namespace },
      getters: rootGetters,
      actions: rootActions,
      mutations,
      modules: {}
    }

    return this.createTree(tree, namespace, modules)
  }

  /**
   * Creates module tree to be registered under top level module
   * from the given entities.
   */
  static createTree (tree: VuexModule<any, any>, namespace: string, modules: Modules): Vuex.Module<any, any> {
    Utils.forOwn(modules, (module, name) => {
      tree.getters[name] = (_state: any, getters: any) => () => {
        return getters.query(name)
      }

      tree.modules[name] = {
        namespaced: true,
        state: {
          ...(typeof module.state === 'function' ? module.state() : module.state),
          ...this.state(),
          $connection: namespace,
          $name: name
        }
      }

      tree.modules[name]['getters'] = { ...subGetters, ...module.getters }

      tree.modules[name]['actions'] = { ...subActions, ...module.actions }

      tree.modules[name]['mutations'] = module.mutations || {}
    })

    return tree
  }
}
