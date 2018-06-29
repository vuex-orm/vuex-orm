import { normalize } from 'normalizr'
import Utils from '../../support/Utils'
import Record from '../../data/Record'
import NormalizedData from '../../data/NormalizedData'
import Query from '../../query/Query'

export default class Normalizer {
  /**
   * Normalize the data given data.
   */
  static process (query: Query, record: Record | Record[]): NormalizedData {
    if (Utils.isEmpty(record)) {
      return {}
    }

    const entity = query.database().schemas[query.model.entity]

    const schema = Array.isArray(record) ? [entity] : entity

    return normalize(record, schema).entities
  }
}
