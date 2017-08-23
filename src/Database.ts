import Vuex from 'vuex'
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
  modules (): Vuex.Module<any, any> {
    return Module.create(this.entities)
  }
}
