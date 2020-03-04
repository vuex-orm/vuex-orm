import { Store } from 'vuex'
import Database from '../database/Database'
import { Collections, InstanceOf } from '../data'
import Model from '../model/Model'
import * as Payloads from '../modules/payloads/Actions'

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
    return this.store.$db()
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
}
