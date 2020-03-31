import Model from '../../model/Model'
import Collection from '../../data/Collection'
import Query from '../Query'

export default class LimitFilter {
  /**
   * Limit the given records by the lmilt and offset.
   */
  static filter<T extends Model = Model>(
    query: Query,
    records: Collection<T>
  ): Collection<T> {
    return records.slice(
      query.offsetNumber,
      query.offsetNumber + query.limitNumber
    )
  }
}
