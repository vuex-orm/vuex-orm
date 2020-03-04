import { Store } from 'vuex'
import Database from '../database/Database'
import { Item, Collection, Collections, InstanceOf } from '../data'
import Model from '../model/Model'
import * as Payloads from '../modules/payloads/Actions'
import Predicate from '../query/contracts/Predicate'

export default class Repository<M extends typeof Model> {
  /**
   * The store instance for the repository.
   */
  store: Store<any>

  /**
   * The model for the repository.
   */
  model: M

  /**
   * Create a new repository instance.
   */
  constructor (store: Store<any>, model: M) {
    this.store = store
    this.model = model
  }

  /**
   * Get the database instance from the store instance.
   */
  database (): Database {
    return this.store.$database
  }

  /**
   * Create a namespaced method name for Vuex Module from the given
   * method name.
   */
  namespace (method: string): string {
    return `${this.database().namespace}/${this.model.entity}/${method}`
  }

  /**
   * Dispatch Vuex Action.
   */
  dispatch (method: string, payload?: any): Promise<any> {
    return this.store.dispatch(this.namespace(method), payload)
  }

  /**
   * Create new data with all fields filled by default values.
   */
  new (): Promise<InstanceOf<M>> {
    return this.dispatch('new')
  }

  /**
   * Save given data to the store by replacing all existing records in the
   * store. If you want to save data without replacing existing records,
   * use the `insert` method instead.
   */
  create (payload: Payloads.Create): Promise<Collections> {
    return this.dispatch('create', payload)
  }

  /**
   * Insert records.
   */
  insert (payload: Payloads.Insert): Promise<Collections> {
    return this.dispatch('insert', payload)
  }

  /**
   * Update records.
   */
  update (payload: Payloads.Update): Promise<Collections> {
    return this.dispatch('update', payload)
  }

  /**
   * Delete records that matches the given condition.
   */
  delete (id: string | number | (number | string)[]): Promise<Item<InstanceOf<M>>>
  delete (condition: Predicate<InstanceOf<M>>): Promise<Collection<InstanceOf<M>>>
  delete (payload: any): any {
    return this.dispatch('delete', payload)
  }

  /**
   * Delete all records from the store.
   */
  deleteAll (): Promise<Collection<InstanceOf<M>>> {
    return this.dispatch('deleteAll')
  }
}
