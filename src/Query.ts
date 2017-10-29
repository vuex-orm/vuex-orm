import _ from './support/lodash'
import { Record, Records } from './Data'
import { State, EntityState } from './Module'

export type Item = Record | null

export type Collection = Record[] | null

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
    const records: Records | null = this.process()

    return this.collect(records)
  }

  /**
   * Returns single record of the query chain result.
   */
  first (id?: number | string): Item {
    const records: Records | null = this.process()

    if (_.isEmpty(records) || records === null) {
      return null
    }

    if (id) {
      return records[id] ? this.item(records[id]) : null
    }

    return this.item(records[Object.keys(records)[0]])
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
   * Process the query and filter data.
   */
  process (): Records | null {
    // First, fetch all records of the entity.
    let records: Records = this.entity.data

    // If the entity is empty, there's nothing we can do so lets return
    // null and exit immediately.
    if (_.isEmpty(records)) {
      return null
    }

    // Now since we have the records, lets check if the where clause is
    // registered. If not, there is nothing we need to do so just
    // return all data.
    if (_.isEmpty(this.wheres)) {
      return records
    }

    // OK so we do have where clause. Lets find specific data user wants.
    records = this.selectByWheres(records)

    // Return here if the user wants records instead of collection.
    return records
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
  collect (records: Records | null): Collection {
    if (records === null || _.isEmpty(records)) {
      return null
    }

    return this.sortByOrders(records)
  }

  /**
   * Filter the given data by registered where clause.
   */
  selectByWheres (records: Records): Records {
    return _.pickBy(records, this.whereClosure()) as any
  }

  /**
   * Sort the given data by registered orders.
   */
  sortByOrders (records: Records): Collection {
    const keys = _.map(this.orders, 'field')
    const directions = _.map(this.orders, 'direction')

    return _.orderBy(records, keys, directions)
  }

  /**
   * Generate predicate from registered where clause.
   */
  whereClosure (): Function {
    const conditions: string = this.whereConditions()

    return new Function('record', `
      return ${conditions}
    `)
  }

  /**
   * Create where conditions to be used with `whereClosure`. The result
   * would look something like;
   *
   *   record['name'] === 'John' && record['age'] === 20
   */
  whereConditions (): string {
    let condition: string = ''

    this.wheres.forEach((cond, index) => {
      if (index > 0) {
        condition = cond.boolean === 'and' ? `${condition} && ` : `${condition} || `
      }

      if (_.isFunction(cond.field)) {
        condition = `${condition}(${cond.field.toString()})(record)`

        return
      }

      if (_.isFunction(cond.value)) {
        condition = `${condition}(${cond.value.toString()})(record['${cond.field}'])`

        return
      }
      const valueText = typeof (cond.value) === 'string' ? `'${cond.value}'` : cond.value
      condition = `${condition}record['${cond.field}'] == ${valueText}`
    })

    return condition
  }
}
