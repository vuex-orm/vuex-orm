import { Store } from 'vuex'
import { Element, Elements } from '../data/Data'
import { Model } from '../model/Model'

export class Connection<M extends Model> {
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
  private getNamespace(): { connection: string; entity: string } {
    const connection = this.store.$database.connection
    const entity = this.model.$entity

    return { connection, entity }
  }

  /**
   * Get the state object from the store.
   */
  private getData(): Elements {
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
  get(): Elements {
    return this.getData()
  }

  /**
   * Find a model by its primary key.
   */
  find(id: string): Element | null {
    return this.getData()[id] ?? null
  }

  /**
   * Find multiple models by their primary keys.
   */
  findIn(ids: string[]): Element[] {
    const data = this.getData()

    return ids.map((id) => data[id])
  }

  /**
   * Commit `insert` change to the store.
   */
  insert(records: Element[]): void {
    this.commit('insert', this.mapElements(records))
  }

  /**
   * Commit `update` change to the store.
   */
  update(records: Element[]): void {
    this.commit('update', this.mapElements(records))
  }

  /**
   * Convert the given array of records into records.
   */
  private mapElements(records: Element[]): Elements {
    return records.reduce<Elements>((carry, record) => {
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
