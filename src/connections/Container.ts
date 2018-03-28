import Database from '../database/Database'
import Connection from './Connection'

export default class Container {
  /**
   * A list of connections that have been registered to the Vuex Store.
   */
  static connections: { [name: string]: Connection } = {}

  /**
   * Create a connection instance and registers it to the connections list.
   */
  static register (name: string, database: Database): void {
    this.connections[name] = new Connection(database)
  }

  /**
   * Find connection with the given from the connection list.
   */
  static connection (name: string): Connection {
    return this.connections[name]
  }
}
