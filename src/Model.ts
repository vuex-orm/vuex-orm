import * as _ from 'lodash'
import * as moment from 'moment'
import { Schema as NormalizrSchema } from 'normalizr'
import Container from './connections/Container'
import Data, { Record, Records, NormalizedData } from './Data'
import Schema from './Schema'
import Attributes, {
  Type as AttrType,
  Attr,
  Date,
  HasOne,
  BelongsTo,
  HasMany
} from './Attributes'

export type Attrs = Attr | Date | HasOne | BelongsTo | HasMany

export interface Fields {
  [field: string]: Attrs
}

export default class Model {
  /**
   * Name of the connection that this model is registerd.
   */
  static connection: string

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
  constructor (data?: Record) {
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
   * The date attribute. This attribute will be converted to moment instance.
   */
  static date (value: any): Date {
    return Attributes.date(value)
  }

  /**
   * Creates has one relationship.
   */
  static hasOne (model: typeof Model | string, foreignKey: string): HasOne {
    return Attributes.hasOne(model, foreignKey)
  }

  /**
   * Creates belongs to relationship.
   */
  static belongsTo (model: typeof Model | string, foreignKey: string): BelongsTo {
    return Attributes.belongsTo(model, foreignKey)
  }

  /**
   * Creates has many relationship.
   */
  static hasMany (model: typeof Model | string, foreignKey: string): HasMany {
    return Attributes.hasMany(model, foreignKey)
  }

  /**
   * Find relation model from the container.
   */
  static relation (name: string): typeof Model {
    return Container.connection(this.connection).model(name)
  }

  /**
   * Resolve relation out of the container.
   */
  static resolveRelation (attr: HasOne | BelongsTo | HasMany): typeof Model {
    return _.isString(attr.model) ? this.relation(attr.model) : attr.model
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

    const normalizedData = Data.normalize(data, schema)

    // Check if all foreign keys exist in the data and if not, make them.
    return _.mapValues(normalizedData, (records, entity) => {
      return this.attachForeignKeys(records, this.relation(entity))
    })
  }

  /**
   * Check if the record has appropriate foreign key and if not, attach them.
   */
  static attachForeignKeys (records: Records, model: typeof Model): Records {
    const fields: Fields = model.fields()

    return _.mapValues(records, (record) => {
      let newRecord: Record = { ...record }

      _.forEach(record, (value, field) => {
        const attr: Attrs = fields[field]

        if (!attr) {
          return value
        }

        if (attr.type === AttrType.Attr) {
          return value
        }

        if (attr.type === AttrType.BelongsTo) {
          const key: string = (attr as BelongsTo).foreignKey

          newRecord[key] = value
        }
      })

      return newRecord
    })
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
  $initialize (data?: Record): void {
    const fields: Fields = this.$mergeFields(data)

    _.forEach(fields, (field, key) => {
      if (field.type === AttrType.Attr) {
        this[key] = field.value

        return
      }

      if (field.type === AttrType.Date) {
        this[key] = moment(field.value)

        return
      }

      if (_.isNumber(field.value)) {
        this[key] = field.value

        return
      }

      if (field.type === AttrType.HasOne) {
        const model = this.$resolveRelation(field as HasOne)

        this[key] = field.value ? new model(field.value) : null

        return
      }

      if (field.type === AttrType.BelongsTo) {
        const model = this.$resolveRelation(field as BelongsTo)

        this[key] = field.value ? new model(field.value) : null

        return
      }

      if (field.type === AttrType.HasMany) {
        const model = this.$resolveRelation(field as HasMany)

        this[key] = field.value ? field.value.map((v: any) => new model(v)) : null
      }
    })
  }

  /**
   * Merge given data into field's default value.
   */
  $mergeFields (data?: Record): Fields {
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

  /**
   * Resolve relation out of the container.
   */
  $resolveRelation (attr: HasOne | BelongsTo | HasMany): typeof Model {
    return this.$self().resolveRelation(attr)
  }

  /**
   * Serialize field values into json.
   */
  $toJson (): any {
    return _.mapValues(this.$self().fields(), (attr, key) => {
      if (!this[key]) {
        return this[key]
      }

      if (attr.type === AttrType.Date) {
        return this[key].toISOString()
      }

      if (attr.type === AttrType.HasOne || attr.type === AttrType.BelongsTo) {
        return this[key].$toJson()
      }

      if (attr.type === AttrType.HasMany) {
        return this[key].map((model: Model) => model.$toJson())
      }

      return this[key]
    })
  }
}
