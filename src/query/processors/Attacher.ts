import Utils from '../../support/Utils'
import NormalizedData from '../../data/NormalizedData'
import Relation from '../../attributes/relations/Relation'
import Query from '../../query/Query'

export default class Attacher {
  /**
   * Attach missing relational key to the records.
   */
  static process (query: Query, data: NormalizedData): NormalizedData {
    Utils.forOwn(data, (entity, name) => {
      const fields = query.getModel(name).fields()

      Utils.forOwn(entity, (record) => {
        Utils.forOwn(record, (value, key) => {
          const field = fields[key]

          if (field instanceof Relation) {
            field.attach(value, record, data)
          }
        })
      })
    })

    return data
  }
}
