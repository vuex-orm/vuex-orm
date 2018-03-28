import * as Vuex from 'vuex'
import Modules from '../database/Modules'
import EntityState from './EntityState'
import rootGetters from './rootGetters'
import rootActions from './rootActions'
import mutations from './mutations'
import subGetters from './subGetters'
import subActions from './subActions'

export default class Module {
  /**
   * The default state. This state will be merged with additional
   * entity's state if it has any.
   */
  static state: EntityState = {
    $connection: '',
    $name: '',
    data: {}
  }

  /**
   * Create module from the given entities.
   */
  static create (namespace: string, modules: Modules): Vuex.Module<any, any> {
    const tree = {
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
  static createTree (tree: any, namespace: string, modules: Modules): Vuex.Module<any, any> {
    Object.keys(modules).forEach((name) => {
      const module = modules[name]

      tree.getters[name] = (_state: any, getters: any) => (wrap: boolean = true) => {
        return getters.query(name, wrap)
      }

      tree.modules[name] = {
        namespaced: true,
        state: {
          ...module.state,
          ...this.state,
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
