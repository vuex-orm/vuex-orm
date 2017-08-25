import * as _ from 'lodash'
import { Record, Records } from './Data'
import { State } from './Module'

export type Item = Record | null

export type Collection = Record[] | null

export interface Wheres {
  field: string
  value: any
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
   * The where constraints for the query.
   */
  protected wheres: Wheres[] = []

  /**
   * Create a new query instance.
   */
  constructor (state: State, entity: string) {
    this.state = state
    this.name = entity
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
   * Process the query and filter data.
   */
  process (): Records | null {
    // First, fetch all records of the entity.
    let records: Records = this.state[this.name].data

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
   * Add a basic where clause to the query.
   */
  where (field: string, value: any): this {
    this.wheres.push({ field, value })

    return this
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
    if (_.isEmpty(records)) {
      return null
    }

    return _.map(records, record => record)
  }

  /**
   * Filter the given data by registered where clause.
   */
  selectByWheres (records: Records): Records {
    const predicate: { [field: string]: any } = this.matchPredicate()

    return _.pickBy<Records, Records>(records, _.matches(predicate))
  }

  /**
   * Generate predicate from registered where clause.
   */
  matchPredicate (): { [field: string]: any } {
    return _.reduce(this.wheres, (predicate, clause) => {
      predicate[clause.field] = clause.value

      return predicate
    }, {} as { [field: string]: any })
  }
}
