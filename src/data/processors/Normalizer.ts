import { normalize } from 'normalizr'
import Utils from '../../support/Utils'
import Query from '../../query/Query'
import NormalizedData from '../NormalizedData'

export default class Normalizer {
  /**
   * Normalize the data.
   */
  static process (data: any, query: Query): NormalizedData {
    if (Utils.isEmpty(data)) {
      return {}
    }

    const entity = query.database().schemas[query.model.entity]

    const schema = Array.isArray(data) ? [entity] : entity

    return normalize(data, schema).entities
  }
}
