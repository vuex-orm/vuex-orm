import Record from '../data/Record'
import Model from './Model'

export default class Serializer {
  /**
   * Serialize given model fields value to json.
   */
  static serialize (model: Model): Record {
    const keys = Object.keys(model.$fields())

    return keys.reduce<Record>((record, key) => {
      const value = model[key]

      record[key] = this.serializeValue(value)

      return record
    }, {})
  }

  /**
   * Serialize given value.
   */
  static serializeValue (value: any): any {
    if (value instanceof Model) {
      return this.serializeItem(value)
    }

    if (Array.isArray(value)) {
      return this.serializeCollection(value)
    }

    return value
  }

  /**
   * Serialize an item into json.
   */
  static serializeItem (item: Model): Record {
    return item.$toJson()
  }

  /**
   * Serialize a collection into json.
   */
  static serializeCollection (collection: (Model | any)[]): Record[] {
    return collection.map((item) => {
      if (item instanceof Model) {
        return item.$toJson()
      }

      return item
    })
  }
}
