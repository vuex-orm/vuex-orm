import * as Vuex from 'vuex'
import * as _ from '../support/lodash'
import Utils from '../support/Utils'
import Container from '../connections/Container'
import Connection from '../connections/Connection'
import { Record } from '../data/Contract'
import AttrContract, { Fields } from '../attributes/contracts/Contract'
import Attribute from '../attributes/Attribute'
import Attr, { Mutator } from '../attributes/types/Attr'
import Increment from '../attributes/types/Increment'
import HasOne from '../attributes/relations/HasOne'
import BelongsTo from '../attributes/relations/BelongsTo'
import HasMany from '../attributes/relations/HasMany'
import HasManyBy from '../attributes/relations/HasManyBy'
import HasManyThrough from '../attributes/relations/HasManyThrough'
import BelongsToMany from '../attributes/relations/BelongsToMany'
import MorphTo from '../attributes/relations/MorphTo'
import MorphOne from '../attributes/relations/MorphOne'
import MorphMany from '../attributes/relations/MorphMany'
import MorphToMany from '../attributes/relations/MorphToMany'
import MorphedByMany from '../attributes/relations/MorphedByMany'

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
   * Create a model instance.
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
   * Create an attr attribute. The given value will be used as a default
   * value for the field.
   */
  static attr (value: any, mutator?: Mutator): Attr {
    return new Attr(this, value, mutator)
  }

  /**
   * Create an increment attribute. The field with this attribute will
   * automatically increment its value when creating a new record.
   */
  static increment (): Increment {
    return new Increment(this)
  }

  /**
   * Create a has one relationship.
   */
  static hasOne (related: typeof Model | string, foreignKey: string, localKey?: string): HasOne {
    return new HasOne(this, related, foreignKey, this.localKey(localKey))
  }

  /**
   * Create a belongs to relationship.
   */
  static belongsTo (parent: typeof Model | string, foreignKey: string, ownerKey?: string): BelongsTo {
    return new BelongsTo(this, parent, foreignKey, this.relation(parent).localKey(ownerKey))
  }

  /**
   * Create a has many relationship.
   */
  static hasMany (related: typeof Model | string, foreignKey: string, localKey?: string): HasMany {
    return new HasMany(this, related, foreignKey, this.localKey(localKey))
  }

  /**
   * Create a has many by relationship.
   */
  static hasManyBy (parent: typeof Model | string, foreignKey: string, ownerKey?: string): HasManyBy {
    return new HasManyBy(this, parent, foreignKey, this.relation(parent).localKey(ownerKey))
  }

  /**
   * Create a has many through relationship.
   */
  static hasManyThrough (
    related: typeof Model | string,
    through: typeof Model | string,
    firstKey: string,
    secondKey: string,
    localKey?: string,
    secondLocalKey?: string
  ): HasManyThrough {
    return new HasManyThrough(
      this,
      related,
      through,
      firstKey,
      secondKey,
      this.localKey(localKey),
      this.relation(through).localKey(secondLocalKey)
    )
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
    return new BelongsToMany(
      this,
      related,
      pivot,
      foreignPivotKey,
      relatedPivotKey,
      this.localKey(parentKey),
      this.relation(related).localKey(relatedKey)
    )
  }

  /**
   * Create a morph to relationship.
   */
  static morphTo (id: string, type: string): MorphTo {
    return new MorphTo(this, id, type)
  }

  /**
   * Create a morph one relationship.
   */
  static morphOne (related: typeof Model | string, id: string, type: string, localKey?: string): MorphOne {
    return new MorphOne(this, related, id, type, this.localKey(localKey))
  }

  /**
   * Create a morph many relationship.
   */
  static morphMany (related: typeof Model | string, id: string, type: string, localKey?: string): MorphMany {
    return new MorphMany(this, related, id, type, this.localKey(localKey))
  }

  /**
   * Create a morph to many relationship.
   */
  static morphToMany (
    related: typeof Model | string,
    pivot: typeof Model | string,
    relatedId: string,
    id: string,
    type: string,
    parentKey?: string,
    relatedKey?: string
  ): MorphToMany {
    return new MorphToMany(
      this,
      related,
      pivot,
      relatedId,
      id,
      type,
      this.localKey(parentKey),
      this.relation(related).localKey(relatedKey)
    )
  }

  /**
   * Create a morphed by many relationship.
   */
  static morphedByMany (
    related: typeof Model | string,
    pivot: typeof Model | string,
    relatedId: string,
    id: string,
    type: string,
    parentKey?: string,
    relatedKey?: string
  ): MorphedByMany {
    return new MorphedByMany(
      this,
      related,
      pivot,
      relatedId,
      id,
      type,
      this.localKey(parentKey),
      this.relation(related).localKey(relatedKey)
    )
  }

  /**
   * Get connection instance out of the container.
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
   * Get local key to pass to the attributes.
   */
  static localKey (key?: string): string {
    if (key) {
      return key
    }

    return typeof this.primaryKey === 'string' ? this.primaryKey : 'id'
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
  static pivotFields (): { [key: string]: BelongsToMany | MorphToMany | MorphedByMany }[] {
    const fields: { [key: string]: BelongsToMany | MorphToMany | MorphedByMany }[] = []

    _.forEach(this.fields(), (field, key) => {
      if (field instanceof BelongsToMany || field instanceof MorphToMany || field instanceof MorphedByMany) {
        fields.push({ [key]: field })
      }
    })

    return fields
  }

  /**
   * Check if fields contains the `belongsToMany` field type.
   */
  static hasPivotFields (): boolean {
    return this.pivotFields().length > 0
  }

  /**
   * Mutators to mutate matching fields when instantiating the model.
   */
  static mutators (): { [field: string]: (value: any) => any } {
    return {}
  }

  /**
   * Get the static class of this model.
   */
  $self (): typeof Model {
    return this.constructor as typeof Model
  }

  /**
   * Get the connection instance out of the container.
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
   * Initialize the model by attaching all of the fields to its property.
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

    return this.$mergeFields({ ...this.$fields() }, data)
  }

  /**
   * Merge given data with fields and create new fields.
   */
  $mergeFields (fields: Fields, data: Record): Fields {
    Utils.forOwn(fields, (attr, key) => {
      if (data[key] === undefined) {
        return
      }

      if (attr instanceof Attribute) {
        attr.set(data[key])

        return
      }

      this.$mergeFields(attr, data[key])
    })

    return fields
  }

  /**
   * Build model by initializing given data.
   */
  $build (self: any, fields: Fields): void {
    _.forEach(fields, (field, key) => {
      if (field instanceof Attribute) {
        self[key] = field.make(fields, key)

        return
      }

      this.$build(self[key] = {}, field)
    })
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

      if (!AttrContract.isAttribute(attr)) {
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
