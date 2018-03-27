import Utils from '../support/Utils'
import Relation from '../attributes/relations/Relation'
import Query from '../query/Query'
import { NormalizedData } from './Contract'

export default class Attacher {
  /**
   * Attach missing relational key to the records.
   */
  static process (data: NormalizedData, Query: Query): NormalizedData {
    Utils.forOwn(data, (entity, name) => {
      const fields = Query.getModel(name).fields()

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
