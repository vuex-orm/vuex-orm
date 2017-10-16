import * as _ from 'lodash'
import * as Vuex from 'vuex'
import Model from './Model'
import Module, { Entity } from './Module'

export default class Database {
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
   * Register namespace to the all regitsered model.
   */
  registerNamespace (namespace: string): void {
    _.forEach(this.entities, entity => { entity.model.connection = namespace })
  }
}
