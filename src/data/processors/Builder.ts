import Utils from '../../support/Utils'
import { Field } from '../../attributes/contracts/Contract'
import Attribute from '../../attributes/Attribute'
import Query from '../../query/Query'
import Record from '../Record'
import NormalizedData from '../NormalizedData'

export default class Builder {
  /**
   * Build missing records with default value based on model schema.
   */
  static build (data: NormalizedData, Query: Query): NormalizedData {
    return Utils.mapValues(data, (records, entity) => {
      const model = Query.getModel(entity)

      return Utils.mapValues(records, (record) => {
        return { ...this.buildFields(record, model.fields()), $id: record.$id }
      })
    })
  }

  /**
   * Build missing fields with the default value based on the model schema.
   * This method is for circuler filling.
   */
  static buildFields (record: Record, fields: Field): Record {
    return Utils.mapValues(fields, (field, key) => {
      if (field instanceof Attribute) {
        return field.fill(record[key])
      }

      return this.buildFields(record[key] || {}, field)
    })
  }
}
