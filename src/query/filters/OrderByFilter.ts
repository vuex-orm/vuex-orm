import Utils from '../../support/Utils'
import Model from '../../model/Model'
import Collection from '../../data/Collection'
import Query from '../Query'

export default class OrderByFilter {
  /**
   * Sort the given data by registered orders.
   */
  static filter<T extends Model = Model>(
    query: Query,
    records: Collection<T>
  ): Collection<T> {
    if (query.orders.length === 0) {
      return records
    }

    const keys = query.orders.map((order) => order.key)
    const directions = query.orders.map((order) => order.direction)

    return Utils.orderBy(records, keys, directions)
  }
}
