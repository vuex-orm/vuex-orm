import { Store } from 'vuex'
import { Record, Records } from '../data/Data'
import Model from '../model/Model'

interface Namespace {
  connection: string
  entity: string
}

export default class Connection<M extends Model> {
  /**
   * The store instance.
   */
  store: Store<any>

  /**
   * The model object.
   */
  model: M

  /**
   * Create a new connection instance.
   */
  constructor(store: Store<any>, model: M) {
    this.store = store
    this.model = model
  }

  /**
   * Get namespace for the modul
   */
  private getNamespace(): Namespace {
    const connection = this.store.$database.connection
    const entity = this.model.$entity

    return { connection, entity }
  }

  /**
   * Get the state object from the store.
   */
  private getData(): Records {
    const { connection, entity } = this.getNamespace()

    return this.store.state[connection][entity].data
  }

  /**
   * Commit the store mutation.
   */
  private commit(name: string, payload?: any): void {
    const { connection, entity } = this.getNamespace()

    this.store.commit(`${connection}/${entity}/${name}`, payload)
  }

  /**
   * Get all existing records.
   */
  get(): Records {
    return this.getData()
  }

  /**
   * Find a model by its primary key.
   */
  find(id: string | number): Record | null {
    return this.getData()[id] ?? null
  }

  /**
   * Find multiple models by their primary keys.
   */
  findIn(ids: string[]): Record[] {
    const data = this.getData()

    return ids.map((id) => data[id])
  }

  /**
   * Commit `insert` change to the store.
   */
  insert(records: Record[]): void {
    this.commit('insert', this.mapRecords(records))
  }

  /**
   * Commit `update` change to the store.
   */
  update(records: Record[]): void {
    this.commit('update', this.mapRecords(records))
  }

  /**
   * Convert the given array of records into records.
   */
  private mapRecords(records: Record[]): Records {
    return records.reduce<Records>((carry, record) => {
      carry[this.model.$getIndexId(record)] = record
      return carry
    }, {})
  }

  /**
   * Commit `delete` change to the store.
   */
  delete(ids: string[]): void {
    this.commit('delete', ids)
  }

  /**
   * Commit `deleteAll` change to the store.
   */
  deleteAll(): void {
    this.commit('deleteAll')
  }
}
