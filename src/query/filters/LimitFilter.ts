import Collection from '../../data/Collection'
import Query from '../Query'

export default class LimitFilter {
  /**
   * Limit the given records by the lmilt and offset.
   */
  static filter (query: Query, records: Collection): Collection {
    return records.slice(query._offset, query._offset + query._limit)
  }
}
