import * as Vuex from 'vuex'
import Modules from '../../database/Modules'
import Module from '../contracts/Module'
import State from '../contracts/State'
import RootState from '../contracts/RootState'
import Getters from '../Getters'
import RootGetters from '../RootGetters'
import Actions from '../Actions'
import RootActions from '../RootActions'
import RootMutations from '../RootMutations'

export default class Builder {
  /**
   * Create module from the given modules.
   */
  static create (namespace: string, modules: Modules): Module {
    const tree: Module = {
      namespaced: true,
      state: { $name: namespace },
      getters: RootGetters,
      actions: RootActions,
      mutations: RootMutations,
      modules: {}
    }

    return this.createModules(tree, namespace, modules)
  }

  /**
   * Creates module tree to be registered under top level module
   * from the given entities.
   */
  static createModules (tree: Module, namespace: string, modules: Modules): Module {
    Object.keys(modules).forEach((name) => {
      const module = modules[name]

      tree.modules[name] = { namespaced: true }

      tree.modules[name].state = this.createState(namespace, name, module)

      tree.getters[name] = (_state: RootState, getters: any, _rootState: any, _rootGetters: any) => () => {
        return getters.query(name)
      }

      tree.modules[name].getters = { ...Getters, ...module.getters }

      tree.modules[name].actions = { ...Actions, ...module.actions }

      tree.modules[name].mutations = module.mutations || {}
    })

    return tree
  }

  /**
   * Get new state to be registered to the modules.
   */
  static createState (namespace: string, name: string, module: Vuex.Module<State, any>): State {
    const state = typeof module.state === 'function' ? module.state() : module.state

    return {
      ...state,
      $connection: namespace,
      $name: name,
      data: {}
    }
  }
}
