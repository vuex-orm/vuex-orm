import { Store } from 'vuex'
import { Records, RecordWithId } from '../data'
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
   * Commit Vuex Mutation.
   */
  private commit(name: string, payload: any): void {
    this.store.commit(`${this.connection}/${name}`, payload)
  }

  /**
   * Commit the given record by `new` method.
   */
  new(record: RecordWithId): void {
    this.commit('new', {
      entity: this.entity,
      data: { [record.$id]: record }
    })
  }

  /**
   * Insert the given record.
   */
  insert(records: RecordWithId[]): void {
    this.commit('new', {
      entity: this.entity,
      data: this.mapRecordToRecords(records)
    })
  }

  /**
   * Insert the given records.
   */
  insertRecords(records: Records): void {
    this.state.data = { ...this.state.data, ...records }
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

  /**
   * Map the given records to `Records` type object.
   */
  private mapRecordToRecords(records: RecordWithId[]): Records {
    return records.reduce<Records>((carry, record) => {
      carry[record.$id] = record
      return carry
    }, {})
  }
}
