import Utils from '../../support/Utils'
import Record from '../../data/Record'
import Query from '../Query'

export default class OrderByFilter {
  /**
   * Sort the given data by registered orders.
   */
  static filter (query: Query, records: Record[]): Record[] {
    if (query.orders.length === 0) {
      return records
    }

    const keys = query.orders.map(order => order.field)
    const directions = query.orders.map(order => order.direction)

    return Utils.orderBy(records, keys, directions)
  }
}
