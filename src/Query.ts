import * as _ from './support/lodash'
import { Record, Records } from './Data'
import { State, EntityState } from './Module'

export type Item = Record | null

export type Collection = Record[]

export type WhereBoolean = 'and' | 'or'

export type OrderDirection = 'asc' | 'desc'

export type Predicate = (item: Record) => boolean

export type Condition = number | string | Predicate

export interface Wheres {
  field: string
  value: any
  boolean: WhereBoolean
}

export interface Orders {
  field: string
  direction: OrderDirection
}

export default class Query {
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
   * The data of the entity.
   */
  protected entity: EntityState

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
   */
  protected _limit: number = Number.MAX_SAFE_INTEGER

  /**
   * Create a new query instance.
   */
  constructor (state: State, name: string) {
    this.state = state
    this.name = name
    this.entity = state[name]
  }

  /**
   * Returns single record of the query chain result.
   */
  get (): Collection {
    const records: Records = this.process()

    return this.collect(records)
  }

  /**
   * Returns single record of the query chain result.
   */
  first (id?: number | string): Item {
    const records: Records = this.process()

    if (_.isEmpty(records)) {
      return null
    }

    if (id !== undefined) {
      return records[id] ? this.item(records[id]) : null
    }

    const sortedRecord = this.sortByOrders(records)

    return this.item(sortedRecord[0])
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
   * Process the query and filter data.
   */
  process (): Records {
    // First, fetch all records of the entity.
    let records: Records = this.entity.data

    // If the entity is empty, there's nothing we can do so lets return
    // data as is and exit immediately.
    if (_.isEmpty(records)) {
      return records
    }

    // Now since we have the records, lets check if the where clause is
    // registered. If not, there is nothing we need to do so just
    // return all data.
    if (_.isEmpty(this.wheres)) {
      return records
    }

    // OK so we do have where clause. Lets find specific data user wants.
    return this.selectByWheres(records)
  }

  /**
   * Add a and where clause to the query.
   */
  where (field: string, value: any): this {
    this.wheres.push({ field, value, boolean: 'and' })

    return this
  }

  /**
   * Add a or where clause to the query.
   */
  orWhere (field: string, value: any): this {
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
   * Create a item from given record.
   */
  item (record?: Record | null): Item {
    return record ? record : null
  }

  /**
   * Create a collection (array) from given records.
   */
  collect (records: Records): Collection {
    return _.isEmpty(records) ? [] : _.slice(this.sortByOrders(records), this._offset, this._offset + this._limit)
  }

  /**
   * Filter the given data by registered where clause.
   */
  selectByWheres (records: Records): Records {
    return _.pickBy(records, record => this.whereOnRecord(record)) as any
  }

  /**
   * Sort the given data by registered orders.
   */
  sortByOrders (records: Records): Record[] {
    const keys = _.map(this.orders, 'field')
    const directions = _.map(this.orders, 'direction')

    return _.orderBy(records, keys, directions)
  }

  /**
   * Checks if given Record matches the registered where clause.
   */
  whereOnRecord (record: Record): boolean {
    let comparator: Function = (where: any) => {
      if (_.isFunction(where.field)) {
        // Function with Record as argument
        return where.field(record)
      } else if (_.isFunction(where.value)) {
        // Function with Record value as argument
        return where.value(record[where.field])
      } else if (_.isArray(where.value)) {
        // Check if field value is in given where Array
        return where.value.indexOf(record[where.field]) !== -1
      } else {
        // Simple equal check
        return record[where.field] === where.value
      }
    }

    let whereTypes: any = _.groupBy(this.wheres, where => where.boolean)
    let whereResults: Array<boolean> = []

    if (whereTypes.and) {
      whereResults.push(_.every(whereTypes.and, comparator))
    }

    if (whereTypes.or) {
      whereResults.push(_.some(whereTypes.or, comparator))
    }

    return whereResults.indexOf(true) !== -1
  }
}
