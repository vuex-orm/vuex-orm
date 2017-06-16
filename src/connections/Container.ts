import Database from '../Database'
import Connection from './Connection'

export interface Connections {
  [name: string]: Database
}

export default class Container {
  /**
   * List of active connection instances.
   */
  static connections: Connections = {}

  /**
   * Register a database to the connections.
   */
  static register (database: Database): void {
    this.connections[database.name] = database
  }

  /**
   * Get a registered connection instance.
   */
  static connection (name: string): Connection {
    return new Connection(this.connections[name])
  }
}
