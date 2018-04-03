import * as Vuex from 'vuex'
import Database from '../database/Database'
import Model from '../model/Model'

export default class Connection {
  /**
   * The database instance.
   */
  database: Database

  /**
   * Creates a connection instance.
   */
  constructor (database: Database) {
    this.database = database
  }

  /**
   * Get Vuex Store instance from the database.
   */
  store (): Vuex.Store<any> {
    if (this.database.store === undefined) {
      throw new Error('Store instance is not registered to the database.')
    }

    return this.database.store
  }

  /**
   * Get models from the database.
   */
  models (): { [entity: string]: typeof Model } {
    return this.database.entities.reduce((models, entity) => {
      return {
        ...models,
        [entity.model.entity]: entity.model
      }
    }, {} as { [entity: string]: typeof Model })
  }

  /**
   * Find model in database by given name.
   */
  model (name: string): typeof Model {
    return this.models()[name]
  }

  /**
   * Get modules from the database.
   */
  modules (): { [entity: string]: Vuex.Module<any, any> } {
    return this.database.entities.reduce((modules, entity) => {
      return {
        ...modules,
        [entity.model.entity]: entity.module
      }
    }, {} as { [entity: string]: Vuex.Module<any, any> })
  }

  /**
   * Find module in database by given name.
   */
  module (name: string): Vuex.Module<any, any> {
    return this.modules()[name]
  }
}
