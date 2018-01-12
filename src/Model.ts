import { Schema as NormalizrSchema } from 'normalizr'
import * as _ from './support/lodash'
import Container from './connections/Container'
import Data, { Record, Records, NormalizedData } from './Data'
import Schema from './Schema'
import Attributes, { Fields, Attribute } from './Attributes'
import AttrTypes from './Attributes/AttrTypes'
import { Attr } from './Attributes/Types'
import { HasOne, BelongsTo, HasMany, HasManyBy } from './Attributes/Relations'

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
   * The primary key to be used for the model.
   */
  static primaryKey: string = 'id'

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
  static attr (value: any, mutator?: (value: any) => any): Attr {
    return Attributes.attr(value, mutator)
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
   * The has many by relationship.
   */
  static hasManyBy (model: typeof Model | string, foreignKey: string, otherKey: string): HasManyBy {
    return Attributes.hasManyBy(model, foreignKey, otherKey)
  }

  /**
   * Mutators to mutate matching fields when instantiating the model.
   */
  static mutators (): { [field: string]: (value: any) => any } {
    return {}
  }

  /**
   * Get a model from the container.
   */
  static relation (name: string): typeof Model {
    return Container.connection(this.connection).model(name)
  }

  /**
   * Resolve relation in the given attribute out of the container.
   */
  static resolveRelation (attr: HasOne | BelongsTo | HasMany | HasManyBy): typeof Model {
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
   * Check if the given record has the appropriate foreign key and
   * if not, attach them.
   */
  static attachForeignKeys (records: Records, model: typeof Model): Records {
    const fields: Fields = model.fields()

    return _.mapValues(records, (record) => {
      let newRecord: Record = { ...record }

      _.forEach(record, (value, field) => {
        const attr = fields[field]

        if (!attr) {
          return
        }

        if (!Attributes.isAttribute(attr)) {
          return
        }

        if (attr.type === AttrTypes.Attr) {
          return
        }

        if (attr.type === AttrTypes.BelongsTo) {
          const key: string = attr.foreignKey

          if (newRecord[key]) {
            return
          }

          newRecord[key] = value
        }
      })

      return newRecord
    })
  }

  /**
   * Get the static class of this model.
   */
  $self (): typeof Model {
    return this.constructor as typeof Model
  }

  /**
   * Get the value of the primary key.
   */
  $id (): any {
    return this[this.$self().primaryKey]
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
    const fields: Fields = this.$merge(data)

    this.$build(this, fields)
  }

  /**
   * Merge given data into field's default value.
   */
  $merge (data?: Record): Fields {
    if (!data) {
      return this.$fields()
    }

    const fields: Fields = { ...this.$fields() }

    return this.$mergeFields(fields, data)
  }

  /**
   * Merge given data with fields and create a new fields.
   */
  $mergeFields (fields: Fields, data?: Record): Fields {
    const keys: string[] = _.keys(fields)

    _.forEach(data, (value, key) => {
      if (!_.includes(keys, key)) {
        return
      }

      if (Attributes.isAttribute(fields[key])) {
        (fields[key] as Attribute).value = value

        return
      }

      fields[key] = this.$mergeFields((fields[key] as any), value)
    })

    return fields
  }

  /**
   * Build model by initializing given data.
   */
  $build (self: any, data: Fields): void {
    _.forEach(data, (field, key) => {
      if (Attributes.isAttribute(field)) {
        self[key] = this.$generateField(field, key)

        return
      }

      this.$build(self[key] = {}, field)
    })
  }

  /**
   * Generate appropreate field value for the given attribute.
   */
  $generateField (attr: Attribute, key: string): any {
    if (attr.value === null) {
      return null
    }

    if (attr.type === AttrTypes.Attr) {
      const mutator = attr.mutator || this.$self().mutators()[key]

      return mutator ? mutator(attr.value) : attr.value
    }

    if (_.isNumber(attr.value) || _.isNumber(attr.value[0])) {
      return null
    }

    const model = this.$resolveRelation(attr)

    if (attr.type === AttrTypes.HasOne || attr.type === AttrTypes.BelongsTo) {
      return attr.value ? new model(attr.value) : null
    }

    if (attr.type === AttrTypes.HasMany || attr.type === AttrTypes.HasManyBy) {
      return attr.value ? attr.value.map((v: any) => new model(v)) : null
    }
  }

  /**
   * Resolve relation out of the container.
   */
  $resolveRelation (attr: HasOne | BelongsTo | HasMany | HasManyBy): typeof Model {
    return this.$self().resolveRelation(attr)
  }

  /**
   * Serialize field values into json.
   */
  $toJson (): any {
    return this.$buildJson(this.$self().fields(), this)
  }

  /**
   * Build Json data.
   */
  $buildJson (data: Fields, field: { [key: string]: any }): any {
    return _.mapValues(data, (attr, key) => {
      if (!field[key]) {
        return field[key]
      }

      if (!Attributes.isAttribute(attr)) {
        return field.$buildJson(attr, field[key])
      }

      if (attr.type === AttrTypes.HasOne || attr.type === AttrTypes.BelongsTo) {
        return field[key].$toJson()
      }

      if (attr.type === AttrTypes.HasMany) {
        return field[key].map((model: Model) => model.$toJson())
      }

      return field[key]
    })
  }
}
