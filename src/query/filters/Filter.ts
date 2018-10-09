import Collection from '../../data/Collection'
import Query from '../Query'
import WhereFilter from './WhereFilter'
import OrderByFilter from './OrderByFilter'
import LimitFilter from './LimitFilter'

export default class Filter {
  /**
   * Filter the given data by registered where clause.
   */
  static where (query: Query, records: Collection): Collection {
    return WhereFilter.filter(query, records)
  }

  /**
   * Sort the given data by registered orders.
   */
  static orderBy (query: Query, records: Collection): Collection {
    return OrderByFilter.filter(query, records)
  }

  /**
   * Limit the given records by the lmilt and offset.
   */
  static limit (query: Query, records: Collection): Collection {
    return LimitFilter.filter(query, records)
  }
}
