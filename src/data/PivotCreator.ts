import Utils from '../support/Utils'
import Query from '../query/Query'
import { NormalizedData } from './Contract'

export default class PivotCreator {
  static create (data: NormalizedData, Query: Query): NormalizedData {
    Object.keys(data).forEach((key) => {
      const model = Query.getModel(key)

      if (model.hasPivotFields()) {
        Utils.forOwn(model.pivotFields(), (field) => {
          Utils.forOwn(field, attr => { attr.createPivots(model, data) })
        })
      }
    })

    return data
  }
}
