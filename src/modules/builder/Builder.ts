import * as Vuex from 'vuex'
import Model from '../../model/Model'
import Models from '../../database/Models'
import Modules from '../../database/Modules'
import Module from '../contracts/Module'
import State from '../contracts/State'
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
      tree.modules[name] = this.createModule(name, namespace, models[name], modules[name])
    })

    return tree
  }

  /**
   * Creates a new module to be registered under top level module
   * from the given entity
   */
  static createModule (name: string, namespace: string, model: typeof Model, module: Vuex.Module<State, any>): Vuex.Module<State, any> {
    return {
      namespaced: true,

      state: this.createState(namespace, name, model, module),

      getters: { ...Getters, ...module.getters },

      actions: { ...Actions, ...module.actions },

      mutations: module.mutations || {}
    }
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
