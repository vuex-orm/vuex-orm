import Utils from '../../support/Utils'
import Query from '../../query/Query'
import NormalizedData from '../NormalizedData'

export default class PivotCreator {
  /**
   * Create an intermediate entity if the data contains any entities that
   * require it for example `belongsTo` or `morphMany`.
   */
  static process (data: NormalizedData, Query: Query): NormalizedData {
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
