import Database from './Database'
import Model from '../model/Model'

export default class HackedDatabase {
  /**
   * The database instance to look up models.
   */
  database: Database

  /**
   * Create a new hacked database.
   */
  constructor (database: Database) {
    this.database = database
  }

  /**
   * Get the hacked model of the given name from the entities list.
   */
  model <M extends typeof Model> (model: M): M
  model (model: string): typeof Model
  model (model: typeof Model | string): typeof Model | string {
    const name = typeof model === 'string' ? model : model.entity

    return this.database.hackedModels[name]
  }
}
