import * as _ from '../support/lodash'
import Utils from '../support/Utils'
import Container from '../connections/Container'
import { Record, PlainItem, PlainCollection } from '../data/Contract'
import { Fields } from '../attributes/contracts/Contract'
import Attribute from '../attributes/Attribute'
import Model from '../model/Model'
import { State, EntityState } from '../modules/Module'

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
  state: State

  /**
   * The name of the entity.
   */
  name: string

  /**
   * The Vuex Store State for of the entity.
   */
  entity: EntityState

  /**
   * The records that have been processed.
   */
  records: PlainCollection = []

  /**
   * The where constraints for the query.
   */
  wheres: Wheres[] = []

  /**
   * The orders of the query result.
   */
  orders: Orders[] = []

  /**
   * Number of results to skip.
   */
  _offset: number = 0

  /**
   * Maximum number of records to return.
   *
   * We use polyfill of `Number.MAX_SAFE_INTEGER` for IE11 here.
   */
  _limit: number = Math.pow(2, 53) - 1

  /**
   * Create a new query instance.
   */
  constructor (state: State, name: string) {
    this.state = state
    this.name = name
    this.entity = state[name]
    this.records = _.map(state[name].data, v => v)
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
   * Update data in the state.
   */
  update (data: Record | ((record: Record) => void), condition: Condition): void {
    if (typeof condition !== 'function') {
      this.entity.data[condition] && this.processUpdate(this.entity.data[condition], data)

      return
    }

    Utils.forOwn(this.entity.data, (record) => {
      condition(record) && this.processUpdate(record, data)
    })
  }

  /**
   * Process the update depending on data type.
   */
  processUpdate (data: Record, record: Record | ((record: Record) => void)): void {
    typeof record === 'function' ? record(data) : this.processUpdateRecursively(data, record, this.model().fields())
  }

  /**
   * Process the update by recursively checking the model schema.
   */
  processUpdateRecursively (data: Record, record: Record, fields: Fields): void {
    Utils.forOwn(fields, (field, key) => {
      if (record[key] === undefined) {
        return
      }

      if (field instanceof Attribute) {
        data[key] = record[key]

        return
      }

      this.processUpdateRecursively(data[key], record[key], field)
    })
  }

  /**
   * Returns single record of the query chain result.
   */
  get (): PlainCollection {
    const records = this.process()

    return this.collect(records)
  }

  /**
   * Returns single record of the query chain result.
   */
  first (id?: number | string): PlainItem {
    const records = this.process()

    if (_.isEmpty(records)) {
      return null
    }

    if (id !== undefined) {
      return this.item(_.find(records, ['$id', id]))
    }

    return this.item(records[0])
  }

  /**
   * Returns the last record of the query chain result.
   */
  last (): PlainItem {
    const records = this.process()

    if (_.isEmpty(records)) {
      return null
    }

    const last = records.length - 1

    return this.item(records[last])
  }

  /**
   * Process the query and filter data.
   */
  process (): PlainCollection {
    let records: PlainCollection = this.records.map(v => ({ ...v }))

    // Process `beforeProcess` hook.
    records = this.executeHooks('beforeProcess', records)

    // If the where clause is registered, lets filter the records beased on it.
    if (!_.isEmpty(this.wheres)) {
      records = this.selectByWheres(records)
    }

    // Process `afterWhere` hook.
    records = this.executeHooks('afterWhere', records)

    // Next, lets sort the data if orderBy is registred.
    if (!_.isEmpty(this.orders)) {
      records = this.sortByOrders(records)
    }

    // Process `afterOrderBy` hook.
    records = this.executeHooks('afterOrderBy', records)

    // Finally, slice the record by limit and offset.
    records = _.slice(records, this._offset, this._offset + this._limit)

    // Process `afterLimit` hook.
    records = this.executeHooks('afterLimit', records)

    return records
  }

  /**
   * Create a item from given record.
   */
  item (record?: PlainItem): PlainItem {
    return record ? record : null
  }

  /**
   * Create a collection (array) from given records.
   */
  collect (records: PlainCollection): PlainCollection {
    return !_.isEmpty(records) ? records : []
  }

  /**
   * Add a and where clause to the query.
   */
  where (field: any, value?: any): this {
    this.wheres.push({ field, value, boolean: 'and' })

    return this
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
  orderBy (field: string, direction: OrderDirection): this {
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
   * Filter the given data by registered where clause.
   */
  selectByWheres (records: PlainCollection): PlainCollection {
    return records.filter(record => this.whereOnRecord(record))
  }

  /**
   * Sort the given data by registered orders.
   */
  sortByOrders (records: PlainCollection): PlainCollection {
    const keys = _.map(this.orders, 'field')
    const directions = _.map(this.orders, 'direction')

    return _.orderBy(records, keys, directions)
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

        return !_.isEmpty(query.where('$id', record['$id']).get())
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
  executeHooks (on: string, records: PlainCollection): PlainCollection {
    let items = records

    this.self().hooks.forEach((hook) => {
      if (hook.on !== on) {
        items = records

        return
      }

      items = hook.callback(items, this.name)
    })

    return items
  }
}
