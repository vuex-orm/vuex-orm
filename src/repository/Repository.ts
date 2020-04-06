import { Store } from 'vuex'
import { ConstructorOf as BaseConstructorOf } from '../types'
import Database from '../database/Database'
import { Record, Item, Collection, Collections } from '../data'
import Model from '../model/Model'
import * as Payloads from '../modules/payloads/Actions'
import PayloadBuilder from '../modules/support/PayloadBuilder'
import Query from '../query/Query'
import Predicate from '../query/contracts/Predicate'
import { PersistOptions } from '../query/options'
import { InsertObject, normalizeInsertPayload } from './support/Payloads'

interface ConstructorOf<C> extends BaseConstructorOf<C> {
  entity: string
}

export default class Repository<M extends Model> {
  /**
   * A special flag to indicate if this is the repository class or not. It's
   * used when retrieving repository instance from `store.$repo()` method to
   * determine whether the passed in class is either a repository or a model.
   */
  static _isRepository: boolean = true

  /**
   * The store instance for the repository.
   */
  store: Store<any>

  /**
   * The model for the repository.
   */
  model!: ConstructorOf<M>

  /**
   * Create a new repository instance.
   */
  constructor(store: Store<any>, model?: ConstructorOf<M>) {
    this.store = store

    if (model) {
      this.model = model
    }
  }

  /**
   * Get the database instance from the store instance.
   */
  database(): Database {
    return this.store.$database
  }

  /**
   * Create a namespaced method name for Vuex Module from the given
   * method name.
   */
  namespace(method: string): string {
    return `${this.database().namespace}/${this.model.entity}/${method}`
  }

  /**
   * Call Vuex Getters.
   */
  getters(method: string): any {
    return this.store.getters[this.namespace(method)]
  }

  /**
   * Dispatch Vuex Action.
   */
  dispatch(method: string, payload?: any): Promise<any> {
    return this.store.dispatch(this.namespace(method), payload)
  }

  /**
   * Create a new model instance.
   */
  make(record?: Record): M {
    return new this.model(record)
  }

  /**
   * Get all records.
   */
  all(): Collection<M> {
    return this.getters('all')()
  }

  /**
   * Find a record.
   */
  find(id: string | number | (number | string)[]): Item<M> {
    return this.getters('find')(id)
  }

  /**
   * Get the record of the given array of ids.
   */
  findIn(idList: (number | string | (number | string)[])[]): Collection<M> {
    return this.getters('findIn')(idList)
  }

  /**
   * Get query instance.
   */
  query(): Query<M> {
    return new Query(this.store, this.model.entity)
  }

  /**
   * Check wether the associated database contains data.
   */
  exists(): boolean {
    return this.query().exists()
  }

  /**
   * Create new data with all fields filled by default values.
   */
  new(): Promise<M> {
    return this.query().new()
  }

  /**
   * Save given data to the store by replacing all existing records in the
   * store. If you want to save data without replacing existing records,
   * use the `insert` method instead.
   */
  create(
    data: Record | Record[] | InsertObject,
    options?: PersistOptions
  ): Promise<Collections> {
    const { data: d, options: o } = normalizeInsertPayload(data, options)

    return this.query().create(d, o)
  }

  /**
   * Insert records.
   */
  insert(
    data: Record | Record[] | InsertObject,
    options?: PersistOptions
  ): Promise<Collections> {
    const { data: d, options: o } = normalizeInsertPayload(data, options)

    return this.query().insert(d, o)
  }

  /**
   * Update records.
   */
  update(
    payload: Payloads.Update,
    options?: PersistOptions
  ): Promise<Collections> {
    return this.dispatch('update', PayloadBuilder.normalize(payload, options))
  }

  /**
   * Insert or update records.
   */
  insertOrUpdate(
    payload: Payloads.InsertOrUpdate,
    options?: PersistOptions
  ): Promise<Collections> {
    return this.dispatch(
      'insertOrUpdate',
      PayloadBuilder.normalize(payload, options)
    )
  }

  /**
   * Delete records that matches the given condition.
   */
  delete(id: string | number | (number | string)[]): Promise<Item<M>>
  delete(condition: Predicate<M>): Promise<Collection<M>>
  delete(payload: any): any {
    return this.dispatch('delete', payload)
  }

  /**
   * Delete all records from the store.
   */
  deleteAll(): Promise<Collection<M>> {
    return this.dispatch('deleteAll')
  }
}
