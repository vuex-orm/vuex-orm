import Utils from '../../support/Utils'
import Instance from '../../data/Instance'
import Collection from '../../data/Collection'
import * as Options from '../options'
import Query from '../Query'

export default class WhereFilter {
  /**
   * Filter the given data by registered where clause.
   */
  static filter (query: Query, records: Collection): Collection {
    if (query.wheres.length === 0) {
      return records
    }

    return records.filter(record => this.check(query, record))
  }

  /**
   * Checks if given Record matches the registered where clause.
   */
  static check (query: Query, record: Instance): boolean {
    const whereTypes = Utils.groupBy(query.wheres, where => where.boolean)
    const comparator = this.getComparator(query, record)

    let results: boolean[] = []

    whereTypes.and && results.push(whereTypes.and.every(comparator))

    whereTypes.or && results.push(whereTypes.or.some(comparator))

    return results.indexOf(true) !== -1
  }

  /**
   * Get comparator for the where clause.
   */
  static getComparator (query: Query, record: Instance): (where: Options.Where) => boolean {
    return (where: Options.Where) => {
      // Function with Record and Query as argument.
      if (typeof where.field === 'function') {
        const newQuery = new Query(query.rootState, query.entity)
        const result = this.executeWhereClosure(newQuery, record, where.field)

        if (typeof result === 'boolean') {
          return result
        }

        // If closure returns undefined, we need to execute the local query
        const matchingRecords = newQuery.get()

        // And check if current record is part of the resul
        return !Utils.isEmpty(matchingRecords.filter((rec: Instance): boolean => {
          return rec['$id'] === record['$id']
        }))
      }

      // Function with Record value as argument.
      if (typeof where.value === 'function') {
        return where.value(record[where.field])
      }

      // Check if field value is in given where Array.
      if (Array.isArray(where.value)) {
        return where.value.indexOf(record[where.field]) !== -1
      }

      // Simple equal check.
      return record[where.field] === where.value
    }
  }

  /**
   * Execute where closure.
   */
  static executeWhereClosure (query: Query, record: Instance, closure: Options.WherePrimaryClosure): boolean | void {
    if (closure.length !== 3) {
      return closure(record, query)
    }

    const model = new query.model(record)

    return closure(record, query, model)
  }
}
