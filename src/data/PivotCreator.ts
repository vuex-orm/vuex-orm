import * as _ from '../support/lodash'
import Query from '../query/Query'
import { NormalizedData } from './Contract'

export default class PivotCreator {
  static create (data: NormalizedData, Query: Query): NormalizedData {
    Object.keys(data).forEach((key) => {
      const model = Query.getModel(key)

      if (model.hasPivotFields()) {
        _.forEach(model.pivotFields(), (field) => {
          _.forEach(field, attr => { attr.createPivots(model, data) })
        })
      }
    })

    return data
  }
}
