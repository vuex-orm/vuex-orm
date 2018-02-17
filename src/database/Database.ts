import * as Vuex from 'vuex'
import * as _ from '../support/lodash'
import Model from '../model/Model'
import Module, { Entity } from '../modules/Module'

export default class Database {
  /**
   * The Vuex Store instance.
   */
  store?: Vuex.Store<any>

  /**
   * The list of entities to be registered to Vuex Store.
   */
  entities: Entity[] = []

  /**
   * Registers a model to the entity list.
   */
  register (model: typeof Model, module: Vuex.Module<any, any>): void {
    this.entities.push({ model, module })
  }

  /**
   * Generate Vuex Module from registered entities.
   */
  modules (namespace: string): Vuex.Module<any, any> {
    return Module.create(namespace, this.entities)
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
    _.forEach(this.entities, entity => { entity.model.connection = namespace })
  }
}
