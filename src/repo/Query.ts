import * as _ from '../support/lodash'
import Container from '../connections/Container'
import { Record } from '../Data'
import Model from '../Model'
import { State, EntityState } from '../Module'

export type Item = Record | null

export type Collection = Record[]

export type WhereBoolean = 'and' | 'or'

export type WherePrimaryClosure = (record: Record, query: Query, model?: Model) => boolean | void

export type WhereSecondaryClosure = (value: any) => boolean

export type OrderDirection = 'asc' | 'desc'

export type Predicate = (item: Record) => boolean

export type Condition = number | string | Predicate

export interface Wheres {
  field: string | number | WherePrimaryClosure
  value: string | number | WhereSecondaryClosure
  boolean: WhereBoolean
}

export interface Orders {
  field: string
  direction: OrderDirection
}

export interface Hooks {
  on: string
  callback: Function
}

export default class Query {
  /**
   * Lifecycle hooks for the query.
   */
  static hooks: Hooks[] = []

  /**
   * The Vuex Store State. This is the target where query will perform
   * CRUD actions.
   */
  protected state: State

  /**
   * The name of the entity.
   */
  protected name: string

  /**
   * The primary key of the entity.
   */
  protected primaryKey: string

  /**
   * The Vuex Store State for of the entity.
   */
  protected entity: EntityState

  /**
   * The records that have been processed.
   */
  protected records: Collection = []

  /**
   * The where constraints for the query.
   */
  protected wheres: Wheres[] = []

  /**
   * The orders of the query result.
   */
  protected orders: Orders[] = []

  /**
   * Number of results to skip.
   */
  protected _offset: number = 0

  /**
   * Maximum number of records to return.
   *
   * We use polyfill of `Number.MAX_SAFE_INTEGER` for IE11 here.
   */
  protected _limit: number = Math.pow(2, 53) - 1

  /**
   * Create a new query instance.
   */
  constructor (state: State, name: string) {
    this.state = state
    this.name = name
    this.entity = state[name]
    this.primaryKey = '$id'
    this.records = _.map(state[name].data, (record: Record) => record)
  }

  /**
   * Register a callback.
   */
  static on (on: string, callback: Function): void {
    this.hooks.push({ on, callback })
  }

  /**
   * Get static query.
   */
  self (): typeof Query {
    return this.constructor as typeof Query
  }

  /**
   * Get the model for the query.
   */
  model (): typeof Model {
    return Container.connection(this.state.name).model(this.name)
  }

  /**
   * Returns single record of the query chain result.
   */
  get (): Collection {
    this.process()

    return this.collect()
  }

  /**
   * Returns single record of the query chain result.
   */
  first (id?: number | string): Item {
    this.process()

    if (_.isEmpty(this.records)) {
      return null
    }

    if (id !== undefined) {
      return this.item(_.find(this.records, [this.primaryKey, id]))
    }

    return this.item(this.records[0])
  }

  /**
   * Process the query and filter data.
   */
  process (): void {
    // Process `beforeProcess` hook.
    this.executeHooks('beforeProcess')

    // If the where clause is registered, lets filter the records beased on it.
    if (!_.isEmpty(this.wheres)) {
      this.selectByWheres()
    }

    // Process `afterWhere` hook.
    this.executeHooks('afterWhere')

    // Next, lets sort the data if orderBy is registred.
    if (!_.isEmpty(this.orders)) {
      this.sortByOrders()
    }

    // Process `afterOrderBy` hook.
    this.executeHooks('afterOrderBy')

    // Finally, slice the record by limit and offset.
    this.records = _.slice(this.records, this._offset, this._offset + this._limit)

    // Process `afterLimit` hook.
    this.executeHooks('afterLimit')
  }

  /**
   * Add a and where clause to the query.
   */
  where (field: any, value?: any): this {
    this.wheres.push({ field, value, boolean: 'and' })

    return this
  }

  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  create (data: any): void {
    this.entity.data = data
  }

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert (data: any): void {
    this.entity.data = { ...this.entity.data, ...data }
  }

  /**
   * Update data in the state.
   */
  update (data: Record, condition: Condition): void {
    if (typeof condition !== 'function') {
      if (this.entity.data[condition]) {
        this.entity.data[condition] = { ...this.entity.data[condition], ...data }
      }

      return
    }

    this.entity.data = _.mapValues(this.entity.data, (record) => {
      return condition(record) ? { ...record, ...data } : record
    })
  }

  /**
   * Add a or where clause to the query.
   */
  orWhere (field: any, value?: any): this {
    this.wheres.push({ field, value, boolean: 'or' })

    return this
  }

  /**
   * Add an order to the query.
   */
  orderBy (field: string, direction: OrderDirection = 'asc'): this {
    this.orders.push({ field, direction })

    return this
  }

  /**
   * Add an offset to the query.
   */
  offset (offset: number): this {
    this._offset = offset

    return this
  }

  /**
   * Add limit to the query.
   */
  limit (limit: number): this {
    this._limit = limit

    return this
  }

  /**
   * Delete data from the state.
   */
  delete (condition: Condition): void {
    if (typeof condition === 'function') {
      this.entity.data = _.pickBy(this.entity.data, record => !condition(record))

      return
    }

    const id = typeof condition === 'number' ? condition.toString() : condition

    this.entity.data = _.pickBy(this.entity.data, (_record, key) => key !== id)
  }

  /**
   * Delete all data from the state.
   */
  deleteAll (): void {
    this.entity.data = {}
  }

  /**
   * Create a item from given record.
   */
  item (record?: Record | null): Item {
    return record ? record : null
  }

  /**
   * Create a collection (array) from given records.
   */
  collect (): Collection {
    return !_.isEmpty(this.records) ? this.records : []
  }

  /**
   * Filter the given data by registered where clause.
   */
  selectByWheres (): void {
    this.records = this.records.filter(record => this.whereOnRecord(record))
  }

  /**
   * Sort the given data by registered orders.
   */
  sortByOrders (): void {
    const keys = _.map(this.orders, 'field')
    const directions = _.map(this.orders, 'direction')

    this.records = _.orderBy(this.records, keys, directions)
  }

  /**
   * Checks if given Record matches the registered where clause.
   */
  whereOnRecord (record: Record): boolean {
    let whereTypes: any = _.groupBy(this.wheres, where => where.boolean)
    let whereResults: boolean[] = []
    let comparator: (where: any) => boolean = this.getComparator(record)

    if (whereTypes.and) {
      whereResults.push(_.every(whereTypes.and, comparator))
    }

    if (whereTypes.or) {
      whereResults.push(_.some(whereTypes.or, comparator))
    }

    return whereResults.indexOf(true) !== -1
  }

  /**
   * Get comparator for the where clause.
   */
  getComparator (record: Record): (where: any) => boolean {
    return (where: any) => {
      // Function with Record and Query as argument.
      if (_.isFunction(where.field)) {
        const query = new Query(this.state, this.name)
        const result = this.executeWhereClosure(record, query, where.field)

        if (typeof result === 'boolean') {
          return result
        }

        return !_.isEmpty(query.where(this.primaryKey, record[this.primaryKey]).get())
      }

      // Function with Record value as argument.
      if (_.isFunction(where.value)) {
        return where.value(record[where.field])
      }

      // Check if field value is in given where Array.
      if (_.isArray(where.value)) {
        return where.value.indexOf(record[where.field]) !== -1
      }

      // Simple equal check.
      return record[where.field] === where.value
    }
  }

  /**
   * Execute where closure.
   */
  executeWhereClosure (record: Record, query: Query, closure: WherePrimaryClosure): boolean | void {
    if (closure.length !== 3) {
      return closure(record, query)
    }

    const model = new (this.model())(record)

    return closure(record, query, model)
  }

  /**
   * Execute the callback of the given hook.
   */
  executeHooks (on: string): void {
    this.self().hooks.forEach((hook) => {
      if (hook.on !== on) {
        return
      }

      this.records = hook.callback(this.records, this.name)
    })
  }
}
