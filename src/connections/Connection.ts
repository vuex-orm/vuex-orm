import * as _ from '../support/lodash'
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
   * Returns models in database with name.
   */
  models (): { [name: string]: typeof Model } {
    let models: { [name: string]: typeof Model } = {}

    _.forEach(this.database.entities, (entity) => {
      models[entity.model.entity] = entity.model
    })

    return models
  }

  /**
   * Find model in database by given name
   */
  model (name: string): typeof Model {
    return this.models()[name]
  }
}
