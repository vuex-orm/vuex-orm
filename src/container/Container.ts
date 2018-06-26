import Database from '../database/Database'

export default class Container {
  /**
   * The database instance that have been registered to the Vuex Store.
   */
  static database: Database

  /**
   * Register the database.
   */
  static register (database: Database): void {
    this.database = database
  }
}
