import Database from '../database/Database'

export default class Container {
  /**
   * A list of databases that have been registered to the Vuex Store.
   */
  static databases: { [name: string]: Database } = {}

  /**
   * Register the given database to the databases list.
   */
  static register (name: string, database: Database): void {
    this.databases[name] = database
  }

  /**
   * Find connection with the given from the connection list.
   */
  static database (name: string): Database {
    return this.databases[name]
  }
}
