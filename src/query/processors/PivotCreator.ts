import Utils from '../../support/Utils'
import NormalizedData from '../../data/NormalizedData'
import Query from '../../query/Query'

export default class PivotCreator {
  /**
   * Create an intermediate entity if the data contains any entities that
   * require it for example `belongsTo` or `morphMany`.
   */
  static process(query: Query, data: NormalizedData): NormalizedData {
    Object.keys(data).forEach((entity) => {
      const model = query.getModel(entity)

      if (model.hasPivotFields()) {
        Utils.forOwn(model.pivotFields(), (field: any) => {
          Utils.forOwn(field, (attr, key) => {
            attr.createPivots(model, data, key)
          })
        })
      }
    })

    return data
  }
}
