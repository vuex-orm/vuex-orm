import Database from '../Database'
import Connection from './Connection'

export interface Connections {
  [name: string]: Connection
}

export default class Container {
  /**
   * A list of connections that has been registered in Vuex ORM.
   */
  static connections: Connections = {}

  /**
   * Create a connection instance and registers it to the connections list.
   */
  static register (name: string, database: Database): void {
    this.connections[name] = new Connection(database)
  }

  /**
   * Find connection from the connection list.
   */
  static connection (name: string): Connection {
    return this.connections[name]
  }
}
