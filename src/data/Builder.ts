import * as _ from '../support/lodash'
import { Field } from '../attributes/contracts/Contract'
import Attribute from '../attributes/Attribute'
import Query from '../query/Query'
import { Record, NormalizedData } from './Contract'

export default class Builder {
  /**
   * Build missing records with default value based on model schema.
   */
  static build (data: NormalizedData, Query: Query): NormalizedData {
    return _.mapValues(data, (records, entity) => {
      const model = Query.getModel(entity)

      return _.mapValues(records, (record) => {
        return { ...this.buildFields(record, model.fields()), $id: record.$id }
      })
    })
  }

  /**
   * Build missing fields with the default value based on the model schema.
   * This method is for circuler filling.
   */
  static buildFields (record: Record, fields: Field): Record {
    return _.mapValues(fields, (field, key) => {
      if (field instanceof Attribute) {
        return field.fill(record[key])
      }

      return this.buildFields(record[key] || {}, field)
    })
  }
}
