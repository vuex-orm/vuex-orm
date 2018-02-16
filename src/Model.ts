import { Schema as NormalizrSchema } from 'normalizr'
import * as Vuex from 'vuex'
import * as _ from './support/lodash'
import Container from './connections/Container'
import Connection from './connections/Connection'
import Data, { Record, Records, NormalizedData } from './Data'
import Schema from './Schema'
import Attribute, { Attributes, Fields } from './repo/Attribute'
import Attr from './repo/types/Attr'
import Increment from './repo/types/Increment'
import HasOne from './repo/relations/HasOne'
import BelongsTo from './repo/relations/BelongsTo'
import HasMany from './repo/relations/HasMany'
import HasManyBy from './repo/relations/HasManyBy'
import BelongsToMany from './repo/relations/BelongsToMany'

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
  static primaryKey: string | string[] = 'id'

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
    return Attribute.attr(value, mutator)
  }

  /**
   * The auto-increment attribute. The field with this attribute will
   * automatically increment its value creating a new record.
   */
  static increment (): Increment {
    return Attribute.increment()
  }

  /**
   * Creates has one relationship.
   */
  static hasOne (related: typeof Model | string, foreignKey: string, localKey?: string): HasOne {
    return Attribute.hasOne(related, foreignKey, this.localKey(localKey), this.connection)
  }

  /**
   * Creates belongs to relationship.
   */
  static belongsTo (parent: typeof Model | string, foreignKey: string, ownerKey?: string): BelongsTo {
    return Attribute.belongsTo(parent, foreignKey, this.relation(parent).localKey(ownerKey), this.connection)
  }

  /**
   * Creates has many relationship.
   */
  static hasMany (related: typeof Model | string, foreignKey: string, localKey?: string): HasMany {
    return Attribute.hasMany(related, foreignKey, this.localKey(localKey), this.connection)
  }

  /**
   * The has many by relationship.
   */
  static hasManyBy (parent: typeof Model | string, foreignKey: string, ownerKey: string): HasManyBy {
    return Attribute.hasManyBy(parent, foreignKey, this.relation(parent).localKey(ownerKey), this.connection)
  }

  /**
   * The belongs to many relationship.
   */
  static belongsToMany (
    related: typeof Model | string,
    pivot: typeof Model | string,
    foreignPivotKey: string,
    relatedPivotKey: string,
    parentKey?: string,
    relatedKey?: string
  ): BelongsToMany {
    return Attribute.belongsToMany(
      related,
      pivot,
      foreignPivotKey,
      relatedPivotKey,
      this.localKey(parentKey),
      this.relation(related).localKey(relatedKey),
      this.connection
    )
  }

  /**
   * Get connection instance out of container.
   */
  static conn (): Connection {
    return Container.connection(this.connection)
  }

  /**
   * Get Vuex Store instance out of connection.
   */
  static store (): Vuex.Store<any> {
    return this.conn().store()
  }

  /**
   * Get module namespaced path for the model.
   */
  static namespace (method: string): string {
    return `${this.connection}/${this.entity}/${method}`
  }

  /**
   * Dispatch an action.
   */
  static dispatch (method: string, payload: any): Promise<any> {
    return this.store().dispatch(this.namespace(method), payload)
  }

  /**
   * Call getetrs.
   */
  static getters (method: string): any {
    return this.store().getters[this.namespace(method)]
  }

  /**
   * Get a model from the container.
   */
  static relation (model: typeof Model | string): typeof Model {
    if (typeof model !== 'string') {
      return model
    }

    return this.conn().model(model)
  }

  /**
   * Get local key to pass to the attributes.
   */
  static localKey (key?: string): string {
    if (key) {
      return key
    }

    return typeof this.primaryKey === 'string' ? this.primaryKey : 'id'
  }

  /**
   * Get the value of the primary key.
   */
  static id (record: any): any {
    const key = this.primaryKey

    if (typeof key === 'string') {
      return record[key]
    }

    return key.map(k => record[k]).join('_')
  }

  /**
   * Get all `increment` fields from the schema.
   */
  static incrementFields (): { [key: string]: Increment }[] {
    const fields: { [key: string]: Increment }[] = []

    _.forEach(this.fields(), (field, key) => {
      if (field instanceof Increment) {
        fields.push({ [key]: field })
      }
    })

    return fields
  }

  /**
   * Check if fields contains the `increment` field type.
   */
  static hasIncrementFields (): boolean {
    return this.incrementFields().length > 0
  }

  /**
   * Get all `belongsToMany` fields from the schema.
   */
  static belongsToManyFields (): { [key: string]: BelongsToMany }[] {
    const fields: { [key: string]: BelongsToMany }[] = []

    _.forEach(this.fields(), (field, key) => {
      if (field instanceof BelongsToMany) {
        fields.push({ [key]: field })
      }
    })

    return fields
  }

  /**
   * Check if fields contains the `belongsToMany` field type.
   */
  static hasBelongsToManyFields (): boolean {
    return this.belongsToManyFields().length > 0
  }

  /**
   * Mutators to mutate matching fields when instantiating the model.
   */
  static mutators (): { [field: string]: (value: any) => any } {
    return {}
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

        if (attr instanceof BelongsTo) {
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
   * Get the connection instance.
   */
  $conn (): Connection {
    return this.$self().conn()
  }

  /**
   * Get Vuex Store insatnce out of connection.
   */
  $store (): Vuex.Store<any> {
    return this.$self().store()
  }

  /**
   * Get module namespaced path for the model.
   */
  $namespace (method: string): string {
    return this.$self().namespace(method)
  }

  /**
   * Dispatch an action.
   */
  $dispatch (method: string, payload: any): Promise<any> {
    return this.$self().dispatch(method, payload)
  }

  /**
   * Call getetrs.
   */
  $getters (method: string): any {
    return this.$self().getters(method)
  }

  /**
   * Get the value of the primary key.
   */
  $id (): any {
    return this.$self().id(this)
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
    const fields = this.$merge(data)

    this.$build(this, fields)
  }

  /**
   * Merge given data into field's default value.
   */
  $merge (data?: Record): Fields {
    if (!data) {
      return this.$fields()
    }

    const fields = { ...this.$fields() }

    return this.$mergeFields(fields, data)
  }

  /**
   * Merge given data with fields and create a new fields.
   */
  $mergeFields (fields: Fields, data?: Record): Fields {
    const keys = _.keys(fields)

    _.forEach(data, (value, key) => {
      if (!_.includes(keys, key)) {
        return
      }

      if (Attribute.isFields(fields[key])) {
        fields[key] = this.$mergeFields((fields[key] as any), value)

        return
      }

      const field = fields[key]

      if (field instanceof Attr || field instanceof Increment) {
        field.value = value
      }

      if (field instanceof HasOne || field instanceof BelongsTo) {
        field.record = value
      }

      if (field instanceof HasMany || field instanceof HasManyBy || field instanceof BelongsToMany) {
        field.records = value
      }
    })

    return fields
  }

  /**
   * Build model by initializing given data.
   */
  $build (self: any, data: Fields): void {
    _.forEach(data, (field, key) => {
      if (Attribute.isAttribute(field)) {
        self[key] = this.$generateField(field, key)

        return
      }

      this.$build(self[key] = {}, field)
    })
  }

  /**
   * Generate appropreate field value for the given attribute.
   */
  $generateField (attr: Attributes, key: string): any {
    if (attr instanceof Attr) {
      const mutator = attr.mutator || this.$self().mutators()[key]

      return mutator ? mutator(attr.value) : attr.value
    }

    if (attr instanceof Increment) {
      return attr.value
    }

    return attr.make()
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

      if (!Attribute.isAttribute(attr)) {
        return field.$buildJson(attr, field[key])
      }

      if (attr instanceof HasOne || attr instanceof BelongsTo) {
        return field[key].$toJson()
      }

      if (attr instanceof HasMany) {
        return field[key].map((model: Model) => model.$toJson())
      }

      return field[key]
    })
  }
}
