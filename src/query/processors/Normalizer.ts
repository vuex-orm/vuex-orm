import { normalize } from 'normalizr'
import Utils from '../../support/Utils'
import Record from '../../data/Record'
import NormalizedData from '../../data/NormalizedData'
import Query from '../../query/Query'
import Schema from '../../schema/Schema'

export default class Normalizer {
  /**
   * Normalize the record.
   */
  static process(query: Query, record: Record | Record[]): NormalizedData {
    if (Utils.isEmpty(record)) {
      return {}
    }

    const schema = new Schema(query.model)
    const normalizerSchema = Utils.isArray(record) ? schema.many(query.model) : schema.one()

    return normalize(record, normalizerSchema).entities as NormalizedData
  }
}
