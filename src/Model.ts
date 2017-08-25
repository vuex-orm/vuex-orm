import * as _ from 'lodash'
import { Schema as NormalizrSchema } from 'normalizr'
import Data, { Records, NormalizedData } from './Data'
import Attributes, { Type as AttrType, Attr, HasOne, BelongsTo } from './Attributes'
import Schema from './Schema'

export interface Fields {
  [field: string]: Attr | HasOne | BelongsTo
}

class Model {
  /**
   * The name that is going be used as module name in Vuex Store.
   */
  static entity: string

  /**
   * Dynamic properties that field data should be assigned at instantiation.
   */
  ;[key: string]: any

  /**
   * Creates a model instance.
   */
  constructor (data?: Records) {
    this.$initialize(data)
  }

  /**
   * The definition of the fields of the model and its relations.
   */
  static fields (): Fields {
    return {}
  }

  /**
   * The generic attribute. The given value will be used as default value
   * of the property when instantiating a model.
   */
  static attr (value: any): Attr {
    return Attributes.attr(value)
  }

  /**
   * Creates has one relationship.
   */
  static hasOne (model: typeof Model, foreignKey: string): HasOne {
    return Attributes.hasOne(model, foreignKey)
  }

  /**
   * Creates belongs to relationship.
   */
  static belongsTo (model: typeof Model, foreignKey: string): BelongsTo {
    return Attributes.belongsTo(model, foreignKey)
  }

  /**
   * Create normalizr schema that represents this model.
   *
   * @param {boolean} many If true, it'll return an array schema.
   */
  static schema (many: boolean = false): NormalizrSchema {
    return many ? Schema.many(this) : Schema.one(this)
  }

  /**
   * Generate normalized data from given data.
   */
  static normalize (data: any | any[]): NormalizedData {
    const schema = this.schema(_.isArray(data))

    return Data.normalize(data, schema)
  }

  /**
   * Returns the static class of this model.
   */
  $self (): typeof Model {
    return this.constructor as typeof Model
  }

  /**
   * The definition of the fields of the model and its relations.
   */
  $fields (): Fields {
    return this.$self().fields()
  }

  /**
   * Initialize the model by attaching all of the fields to property.
   */
  $initialize (data?: Records): void {
    const fields: Fields = this.$mergeFields(data)

    _.forEach(fields, (field, key) => {
      if (field.type === AttrType.Attr) {
        this[key] = field.value

        return
      }

      if (field.type === AttrType.HasOne) {
        this[key] = new (field as HasOne).model(field.value)

        return
      }

      if (field.type === AttrType.BelongsTo) {
        this[key] = new (field as BelongsTo).model(field.value)
      }
    })
  }

  /**
   * Merge given data into field's default value.
   */
  $mergeFields (data?: Records): Fields {
    if (!data) {
      return this.$fields()
    }

    let newFields: Fields = { ...this.$fields() }

    const fieldKeys: string[] = _.keys(newFields)

    _.forEach(data, (value, key) => {
      if (!_.includes(fieldKeys, key)) {
        return
      }

      newFields[key].value = value
    })

    return newFields
  }
}

export default Model
