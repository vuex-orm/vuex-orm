import { Store } from 'vuex'
import Record from '../data/Record'
import Records from '../data/Records'
import RootState from '../modules/contracts/RootState'
import State from '../modules/contracts/State'

export default class Connection {
  /**
   * The store instance.
   */
  store: Store<any>

  /**
   * The connection name.
   */
  connection: string

  /**
   * The entity name.
   */
  entity: string

  /**
   * The root state.
   */
  rootState: RootState

  /**
   * The entity state.
   */
  state: State

  /**
   * Create a new connection instance.
   */
  constructor(store: Store<any>, connection: string, entity: string) {
    this.store = store
    this.connection = connection
    this.entity = entity
    this.rootState = this.store.state[connection]
    this.state = this.rootState[entity]
  }

  /**
   * Insert the given record.
   */
  insert(record: Record): void {
    this.state.data = { ...this.state.data, [record.$id]: record }
  }

  /**
   * Insert the given records.
   */
  insertRecords(records: Records): void {
    this.state.data = { ...this.state.data, ...records }
  }

  /**
   * Updates the given record.
   */
  update(newId: String, record: Record): void {
    delete this.state.data[record.$id]
    record.$id = newId
    this.state.data = { ...this.state.data, [record.$id]: record }
  }

  /**
   * Delete records that matches the given id.
   */
  delete(id: string[]): void {
    const data: Records = {}

    for (const i in this.state.data) {
      if (!id.includes(i)) {
        data[i] = this.state.data[i]
      }
    }

    this.state.data = data
  }
}
