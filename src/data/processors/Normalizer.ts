import { normalize } from 'normalizr'
import Utils from '../../support/Utils'
import Query from '../../query/Query'
import NormalizedData from '../NormalizedData'
import Schema from './Schema'

export default class Normalizer {
  /**
   * Normalize the data.
   */
  static process (data: any, Query: Query): NormalizedData {
    if (Utils.isEmpty(data)) {
      return {}
    }

    const schema = Array.isArray(data) ? Schema.many(Query.model) : Schema.one(Query.model)

    return normalize(data, schema).entities
  }
}
