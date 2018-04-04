import Utils from '../../support/Utils'
import Query from '../../query/Query'
import NormalizedData from '../NormalizedData'

export default class PivotCreator {
  /**
   * Create an intermediate entity if the data contains any entities that
   * require it for example `belongsTo` or `morphMany`.
   */
  static process (data: NormalizedData, Query: Query): NormalizedData {
    Object.keys(data).forEach((entity) => {
      const model = Query.getModel(entity)

      if (model.hasPivotFields()) {
        Utils.forOwn(model.pivotFields(), (field) => {
          Utils.forOwn(field, (attr, key) => { attr.createPivots(model, data, key) })
        })
      }
    })

    return data
  }
}
