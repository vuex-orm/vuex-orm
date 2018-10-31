import * as Vuex from 'vuex'
import Model from '../../model/Model'
import Models from '../../database/Models'
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
  static create (namespace: string, models: Models, modules: Modules): Module {
    const tree: Module = {
      namespaced: true,
      state: { $name: namespace },
      getters: RootGetters,
      actions: RootActions,
      mutations: RootMutations,
      modules: {}
    }

    return this.createModules(tree, namespace, models, modules)
  }

  /**
   * Creates module tree to be registered under top level module
   * from the given entities.
   */
  static createModules (tree: Module, namespace: string, models: Models, modules: Modules): Module {
    Object.keys(modules).forEach((name) => {
      const model = models[name]
      const module = modules[name]

      tree.modules[name] = { namespaced: true }

      tree.modules[name].state = this.createState(namespace, name, model, module)

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
  static createState (namespace: string, name: string, model: typeof Model, module: Vuex.Module<State, any>): State {
    const modelState = typeof model.state === 'function' ? (model.state as Function)() : model.state
    const moduleState = typeof module.state === 'function' ? (module.state as Function)() : module.state

    return {
      ...modelState,
      ...moduleState,
      $connection: namespace,
      $name: name,
      data: {}
    }
  }
}
