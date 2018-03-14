import * as _ from '../support/lodash'
import Query from '../query/Query'
import { NormalizedData } from './Contract'

export default class PivotCreator {
  static create (data: NormalizedData, Query: Query): NormalizedData {
    if (!Query.model.hasPivotFields()) {
      return data
    }

    _.forEach(Query.model.pivotFields(), (field) => {
      _.forEach(field, attr => { attr.createPivots(Query.model, data) })
    })

    return data
  }
}
