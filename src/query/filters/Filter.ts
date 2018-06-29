import Record from '../../data/Record'
import Query from '../Query'
import WhereFilter from './WhereFilter'
import OrderByFilter from './OrderByFilter'
import LimitFilter from './LimitFilter'

export default class Filter {
  /**
   * Filter the given data by registered where clause.
   */
  static where (query: Query, records: Record[]): Record[] {
    return WhereFilter.filter(query, records)
  }

  /**
   * Sort the given data by registered orders.
   */
  static orderBy (query: Query, records: Record[]): Record[] {
    return OrderByFilter.filter(query, records)
  }

  /**
   * Limit the given records by the lmilt and offset.
   */
  static limit (query: Query, records: Record[]): Record[] {
    return LimitFilter.filter(query, records)
  }
}
