import * as Vuex from 'vuex'
import Model from '../model/Model'
import Module from '../modules/Module'
import Entity from './Entity'
import Modules from './Modules'

export default class Database {
  /**
   * The Vuex Store instance.
   */
  store?: Vuex.Store<any>

  /**
   * The list of entities to be registered to the Vuex Store. It contains
   * models and modules with its name.
   */
  entities: Entity[] = []

  /**
   * Register a model and module to the entities list.
   */
  register (model: typeof Model, module: Vuex.Module<any, any>): void {
    this.entities.push({
      name: model.entity,
      model,
      module
    })
  }

  /**
   * Get all modules from the entities list.
   */
  modules (): Modules {
    return this.entities.reduce((modules, entity) => {
      modules[entity.name] = entity.module

      return modules
    }, {} as Modules)
  }

  /**
   * Create the Vuex Module from registered entities.
   */
  createModule (namespace: string): Vuex.Module<any, any> {
    return Module.create(namespace, this.modules())
  }

  /**
   * Register a Vuex Store instance.
   */
  registerStore (store: Vuex.Store<any>): void {
    this.store = store
  }

  /**
   * Register namespace to the all regitsered model.
   */
  registerNamespace (namespace: string): void {
    Model.connection = namespace
  }
}
