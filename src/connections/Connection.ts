import _ from '../support/lodash'
import Model from '../Model'
import Database from '../Database'

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
