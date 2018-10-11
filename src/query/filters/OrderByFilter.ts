import Utils from '../../support/Utils'
import Collection from '../../data/Collection'
import Query from '../Query'

export default class OrderByFilter {
  /**
   * Sort the given data by registered orders.
   */
  static filter (query: Query, records: Collection): Collection {
    if (query.orders.length === 0) {
      return records
    }

    const keys = query.orders.map(order => order.field)
    const directions = query.orders.map(order => order.direction)

    return Utils.orderBy(records, keys, directions)
  }
}
