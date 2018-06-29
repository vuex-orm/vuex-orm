import Record from '../../data/Record'
import Query from '../Query'

export default class LimitFilter {
  /**
   * Limit the given records by the lmilt and offset.
   */
  static filter (query: Query, records: Record[]): Record[] {
    return records.slice(query._offset, query._offset + query._limit)
  }
}
