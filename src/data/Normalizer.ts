import { normalize } from 'normalizr'
import * as _ from '../support/lodash'
import Query from '../query/Query'
import { NormalizedData } from './Contract'
import Schema from './Schema'
import PivotCreator from './PivotCreator'

export default class Data {
  /**
   * Normalize the data.
   */
  static normalize (data: any, Query: Query): NormalizedData {
    if (_.isEmpty(data)) {
      return {}
    }

    const schema = Array.isArray(data) ? Schema.many(Query.model) : Schema.one(Query.model)

    const normalizedData = normalize(data, schema).entities

    return PivotCreator.create(normalizedData, Query)
  }
}
