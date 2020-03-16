import { Store } from 'vuex'
import Database from '../database/Database'
import { Record, Item, Collection, Collections } from '../data'
import Model from '../model/Model'
import * as Payloads from '../modules/payloads/Actions'
import Query from '../query/Query'
import Predicate from '../query/contracts/Predicate'

type ConstructorOf<C> = {
  new (...args: any[]): C
  entity: string
}

export default class Repository<M extends Model> {
  /**
   * The store instance for the repository.
   */
  store: Store<any>

  /**
   * The model for the repository.
   */
  model: ConstructorOf<M>

  /**
   * Create a new repository instance.
   */
  constructor (store: Store<any>, model: ConstructorOf<M>) {
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
   * Call Vuex Getetrs.
   */
  getters (method: string): any {
    return this.store.getters[this.namespace(method)]
  }

  /**
   * Dispatch Vuex Action.
   */
  dispatch (method: string, payload?: any): Promise<any> {
    return this.store.dispatch(this.namespace(method), payload)
  }

  /**
   * Create a new model instance.
   */
  make (record?: Record): M {
    return new this.model(record)
  }

  /**
   * Get all records.
   */
  all (): Collection<M> {
    return this.getters('all')()
  }

  /**
   * Find a record.
   */
  find (id: string | number | (number | string)[]): Item<M> {
    return this.getters('find')(id)
  }

  /**
   * Get the record of the given array of ids.
   */
  findIn (idList: (number | string | (number | string)[])[]): Collection<M> {
    return this.getters('findIn')(idList)
  }

  /**
   * Get query instance.
   */
  query (): Query<M> {
    return this.getters('query')()
  }

  /**
   * Check wether the associated database contains data.
   */
  exists (): boolean {
    return this.query().exists()
  }

  /**
   * Create new data with all fields filled by default values.
   */
  new (): Promise<M> {
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
   * Insert or update records.
   */
  insertOrUpdate (payload: Payloads.InsertOrUpdate): Promise<Collections> {
    return this.dispatch('insertOrUpdate', payload)
  }

  /**
   * Delete records that matches the given condition.
   */
  delete (id: string | number | (number | string)[]): Promise<Item<M>>
  delete (condition: Predicate<M>): Promise<Collection<M>>
  delete (payload: any): any {
    return this.dispatch('delete', payload)
  }

  /**
   * Delete all records from the store.
   */
  deleteAll (): Promise<Collection<M>> {
    return this.dispatch('deleteAll')
  }
}
