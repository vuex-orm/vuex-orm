import * as Vuex from 'vuex'
import Utils from '../support/Utils'
import Container from '../container/Container'
import Database from '../database/Database'
import Record from '../data/Record'
import Item from '../data/Item'
import Collection from '../data/Collection'
import Collections from '../data/Collections'
import State from '../modules/contracts/State'
import * as Attributes from '../attributes'
import Mutator from '../attributes/contracts/Mutator'
import Mutators from '../attributes/contracts/Mutators'
import Query from '../query/Query'
import * as Payloads from '../modules/payloads/Actions'
import Fields from './contracts/Fields'
import FieldCache from './contracts/FieldCache'
import ModelState from './contracts/State'
import Serializer from './Serializer'
import NoKey from '../schema/NoKey'
import InheritanceTypes from './contracts/InheritanceTypes'

type InstanceOf<T> = T extends new (...args: any[]) => infer R ? R : any

export default class Model {
  /**
   * The name that is going be used as module name in Vuex Store.
   */
  static entity: string

  /**
   * The reference to the base entity name if the class extends a base entity
   * TODO: find a proper way to compute this, right now, the only way found was
   * to do declare
   * static baseEntity (): typeof Model {
   *  let $this = new this()
   *  return this.$root()
   * }
   * but this might cause side effects as we instanciate a new this, which will trigger
   * closure on default values (like increment thus jumping one int)
   */
  static baseEntity: string

  /**
   * The primary key to be used for the model.
   */
  static primaryKey: string | string[] = 'id'

  /**
   * The discriminator key to be used for the model when inheritance is used
   */
  static typeKey: string = 'type'

  /**
   * Vuex Store state definition.
   */
  static state: ModelState | (() => ModelState) = {}

  /**
   * The cached attribute fields of the model.
   */
  static cachedFields: FieldCache

  /**
   * The ID value of the store index.
   */
  $id: string | null = null

  /**
   * Create a new model instance.
   */
  constructor (record?: Record) {
    this.$fill(record)
  }

  /**
   * The definition of the fields of the model and its relations.
   */
  static fields (): Fields {
    return {}
  }

  /**
   * Get the model schema definition by adding additional default fields.
   */
  static getFields (): Fields {
    if (!this.cachedFields) {
      this.cachedFields = {}
    }

    if (this.cachedFields[this.entity]) {
      return this.cachedFields[this.entity]
    }

    this.cachedFields[this.entity] = this.fields()

    return this.cachedFields[this.entity]
  }

  /**
   * Create an attr attribute. The given value will be used as a default
   * value for the field.
   */
  static attr (value: any, mutator?: Mutator<any>): Attributes.Attr {
    return new Attributes.Attr(this, value, mutator)
  }

  /**
   * Create a string attribute.
   */
  static string (value: any, mutator?: Mutator<string | null>): Attributes.String {
    return new Attributes.String(this, value, mutator)
  }

  /**
   * Create a number attribute.
   */
  static number (value: any, mutator?: Mutator<number | null>): Attributes.Number {
    return new Attributes.Number(this, value, mutator)
  }

  /**
   * Create a boolean attribute.
   */
  static boolean (value: any, mutator?: Mutator<boolean | null>): Attributes.Boolean {
    return new Attributes.Boolean(this, value, mutator)
  }

  /**
   * Create an increment attribute. The field with this attribute will
   * automatically increment its value when creating a new record.
   */
  static increment (): Attributes.Increment {
    return new Attributes.Increment(this)
  }

  /**
   * Create a has one relationship.
   */
  static hasOne (related: typeof Model | string, foreignKey: string, localKey?: string): Attributes.HasOne {
    return new Attributes.HasOne(this, related, foreignKey, this.localKey(localKey))
  }

  /**
   * Create a belongs to relationship.
   */
  static belongsTo (parent: typeof Model | string, foreignKey: string, ownerKey?: string): Attributes.BelongsTo {
    return new Attributes.BelongsTo(this, parent, foreignKey, this.relation(parent).localKey(ownerKey))
  }

  /**
   * Create a has many relationship.
   */
  static hasMany (related: typeof Model | string, foreignKey: string, localKey?: string): Attributes.HasMany {
    return new Attributes.HasMany(this, related, foreignKey, this.localKey(localKey))
  }

  /**
   * Create a has many by relationship.
   */
  static hasManyBy (parent: typeof Model | string, foreignKey: string, ownerKey?: string): Attributes.HasManyBy {
    return new Attributes.HasManyBy(this, parent, foreignKey, this.relation(parent).localKey(ownerKey))
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
  ): Attributes.HasManyThrough {
    return new Attributes.HasManyThrough(
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
  ): Attributes.BelongsToMany {
    return new Attributes.BelongsToMany(
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
  static morphTo (id: string, type: string): Attributes.MorphTo {
    return new Attributes.MorphTo(this, id, type)
  }

  /**
   * Create a morph one relationship.
   */
  static morphOne (related: typeof Model | string, id: string, type: string, localKey?: string): Attributes.MorphOne {
    return new Attributes.MorphOne(this, related, id, type, this.localKey(localKey))
  }

  /**
   * Create a morph many relationship.
   */
  static morphMany (related: typeof Model | string, id: string, type: string, localKey?: string): Attributes.MorphMany {
    return new Attributes.MorphMany(this, related, id, type, this.localKey(localKey))
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
  ): Attributes.MorphToMany {
    return new Attributes.MorphToMany(
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
  ): Attributes.MorphedByMany {
    return new Attributes.MorphedByMany(
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
   * Mutators to mutate matching fields when instantiating the model.
   */
  static mutators (): Mutators {
    return {}
  }

  /**
   * Types mapping used to dispatch entities based on their discriminator field
   */
  static types (): InheritanceTypes {
    return {}
  }

  /**
   * Get the database instance from the container.
   */
  static database (): Database {
    return Container.database
  }

  /**
   * Get the store instance from the container.
   */
  static store (): Vuex.Store<any> {
    return this.database().store
  }

  /**
   * Create a namespaced method name for Vuex Module from the given
   * method name.
   */
  static namespace (method: string): string {
    return `${this.database().namespace}/${this.entity}/${method}`
  }

  /**
   * Call Vuex Getters.
   */
  static getters (method: string): any {
    return this.store().getters[this.namespace(method)]
  }

  /**
   * Dispatch Vuex Action.
   */
  static dispatch (method: string, payload?: any): Promise<any> {
    return this.store().dispatch(this.namespace(method), payload)
  }

  /**
   * Commit Vuex Mutation.
   */
  static commit (callback: (state: State) => void) {
    this.store().commit(`${this.database().namespace}/$mutate`, {
      entity: this.entity,
      callback
    })
  }

  /**
   * Get all records.
   */
  static all<T extends typeof Model> (this: T): Collection<InstanceOf<T>> {
    return this.getters('all')()
  }

  /**
   * Find a record.
   */
  static find<T extends typeof Model> (this: T, id: string | number): Item<InstanceOf<T>> {
    return this.getters('find')(id)
  }

  /**
   * Get the record of the given array of ids.
   */
  static findIn<T extends typeof Model> (this: T, idList: Array<number | string>): Collection<InstanceOf<T>> {
    return this.getters('findIn')(idList)
  }

  /**
   * Get query instance.
   */
  static query<T extends typeof Model> (this: T): Query<InstanceOf<T>> {
    return this.getters('query')()
  }

  /**
   * Create new data with all fields filled by default values.
   */
  static new (): Promise<Model> {
    return this.dispatch('new')
  }

  /**
   * Save given data to the store by replacing all existing records in the
   * store. If you want to save data without replacing existing records,
   * use the `insert` method instead.
   */
  static create<T extends typeof Model> (this: T, payload: Payloads.Create): Promise<Collections<InstanceOf<T>>> {
    return this.dispatch('create', payload)
  }

  /**
   * Insert records.
   */
  static insert<T extends typeof Model> (this: T, payload: Payloads.Insert): Promise<Collections<InstanceOf<T>>> {
    return this.dispatch('insert', payload)
  }

  /**
   * Update records.
   */
  static update<T extends typeof Model> (this: T, payload: Payloads.Update): Promise<Collections<InstanceOf<T>>> {
    return this.dispatch('update', payload)
  }

  /**
   * Insert or update records.
   */
  static insertOrUpdate<T extends typeof Model> (this: T, payload: Payloads.InsertOrUpdate): Promise<Collections<InstanceOf<T>>> {
    return this.dispatch('insertOrUpdate', payload)
  }

  /**
   * Delete records that matches the given condition.
   */
  static delete<T extends typeof Model> (this: T, payload: Payloads.Delete): Promise<Item<InstanceOf<T>> | Collection<InstanceOf<T>>> {
    return this.dispatch('delete', payload)
  }

  /**
   * Delete all records.
   */
  static deleteAll (): Promise<void> {
    return this.dispatch('deleteAll')
  }

  /**
   * Get the value of the primary key.
   */
  static id (record: any): any {
    const key = this.primaryKey

    if (typeof key === 'string') {
      return record[key]
    }

    return key.map(k => (record[k] || NoKey.increment())).join('_')
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
   * Get the model object that matches the given record type. The method is for
   * getting the correct model object when the model has any inheritance
   * children model.
   *
   * For example, if a User Model have `static types()` declared, and if you
   * pass record with `{ type: 'admin' }`, then the method will likely to
   * return SuperUser class.
   */
  static getModelFromRecord (record: Record | Model): typeof Model | null {
    // If the given record is already a model instance, return the
    // model object.
    if (record instanceof Model) {
      return record.$self()
    }

    // Else, get the corresponding model for the type value if there's any.
    return this.getTypeModel(record[this.typeKey])
  }

  /**
   * Get a model from the container.
   */
  static relation (model: typeof Model | string): typeof Model {
    if (typeof model !== 'string') {
      return model
    }

    return this.database().model(model)
  }

  /**
   * Get the attribute class for the given attribute name.
   */
  static getAttributeClass (name: string): typeof Attributes.Attribute {
    switch (name) {
      case 'increment': return Attributes.Increment

      default:
        throw Error(`The attribute name "${name}" doesn't exist.`)
    }
  }

  /**
   * Get all of the fields that matches the given attribute name.
   */
  static getFieldsByAttribute (name: string): { [key: string]: Attributes.Attribute } {
    const attr = this.getAttributeClass(name)
    const fields = this.getFields()

    return Object.keys(fields).reduce((newFields, key) => {
      const field = fields[key]

      if (field instanceof attr) {
        newFields[key] = field
      }

      return newFields
    }, {} as { [key: string]: Attributes.Attribute })
  }

  /**
   * Get all `increment` fields from the schema.
   */
  static getIncrementFields (): { [key: string]: Attributes.Increment } {
    return this.getFieldsByAttribute('increment') as { [key: string]: Attributes.Increment }
  }

  /**
   * Check if fields contains the `increment` field type.
   */
  static hasIncrementFields (): boolean {
    return Object.keys(this.getIncrementFields()).length > 0
  }

  /**
   * Get all `belongsToMany` fields from the schema.
   */
  static pivotFields (): { [key: string]: Attributes.BelongsToMany | Attributes.MorphToMany | Attributes.MorphedByMany }[] {
    const fields: { [key: string]: Attributes.BelongsToMany | Attributes.MorphToMany | Attributes.MorphedByMany }[] = []

    Utils.forOwn(this.getFields(), (field, key) => {
      if (field instanceof Attributes.BelongsToMany || field instanceof Attributes.MorphToMany || field instanceof Attributes.MorphedByMany) {
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
   * Check if the current model has a type definition
   */
  static hasTypes (): boolean {
    return Object.keys(this.types()).length > 0
  }

  /**
   * Get the model corresponding to the given type name. If it can't be found,
   * it'll return `null`.
   */
  static getTypeModel (name: string): typeof Model | null {
    return this.types()[name] || null
  }

  /**
   * Given a Model, this returns the corresponding key in the InheritanceTypes mapping
   */
  static getTypeKeyValueFromModel (model?: typeof Model): string | null {
    const modelToCheck = model || this
    const types = this.types()
    for (const type in types) {
      if (types[type] === modelToCheck) {
        return type
      }
    }
    return null
  }

  /**
   * Tries to find a Relation field in all types defined in the InheritanceTypes mapping
   */
  static findRelationInSubTypes (relationName: string): Attributes.Relation | null {

    const types = this.types()

    for (const type in types) {
      const fields = types[type].getFields()

      for (const fieldName in fields) {
        if (fieldName === relationName && fields[fieldName] instanceof Attributes.Relation) {
          return fields[fieldName] as Attributes.Relation
        }
      }
    }

    return null
  }

  /**
   * Fill any missing fields in the given record with the default value defined
   * in the model schema.
   */
  static hydrate (record?: Record): Record {
    return (new this(record)).$toJson()
  }

  /**
   * Get the constructor of this model.
   */
  $self (): typeof Model {
    return this.constructor as typeof Model
  }

  /**
   * The definition of the fields of the model and its relations.
   */
  $fields (): Fields {
    return this.$self().getFields()
  }

  /**
   * Get the store instance from the container.
   */
  $store (): Vuex.Store<any> {
    return this.$self().store()
  }

  /**
   * Create a namespaced method name for Vuex Module from the given
   * method name.
   */
  $namespace (method: string): string {
    return this.$self().namespace(method)
  }

  /**
   * Call Vuex Getetrs.
   */
  $getters (method: string): any {
    return this.$self().getters(method)
  }

  /**
   * Dispatch Vuex Action.
   */
  async $dispatch (method: string, payload?: any): Promise<any> {
    return this.$self().dispatch(method, payload)
  }

  /**
   * Get all records.
   */
  $all<T extends Model> (this: T): Collection<T> {
    return this.$getters('all')()
  }

  /**
   * Find a record.
   */
  $find<T extends Model> (this: T, id: string | number): Item<T> {
    return this.$getters('find')(id)
  }

  /**
   * Find record of the given array of ids.
   */
  $findIn<T extends Model> (this: T, idList: Array<number | string>): Collection<T> {
    return this.$getters('findIn')(idList)
  }

  /**
   * Get query instance.
   */
  $query (): Query {
    return this.$getters('query')()
  }

  /**
   * Create records.
   */
  async $create<T extends Model> (this: T, payload: Payloads.Create): Promise<Collections<T>> {
    return this.$dispatch('create', payload)
  }

  /**
   * Create records.
   */
  async $insert<T extends Model> (this: T, payload: Payloads.Insert): Promise<Collections<T>> {
    return this.$dispatch('insert', payload)
  }

  /**
   * Update records.
   */
  async $update<T extends Model> (this: T, payload: Payloads.Update): Promise<Collections<T>> {
    if (Array.isArray(payload)) {
      return this.$dispatch('update', payload)
    }

    if (payload.where !== undefined) {
      return this.$dispatch('update', payload)
    }

    if (this.$self().id(payload) === undefined) {
      return this.$dispatch('update', { where: this.$id, data: payload })
    }

    return this.$dispatch('update', payload)
  }

  /**
   * Insert or update records.
   */
  async $insertOrUpdate<T extends Model> (this: T, payload: Payloads.InsertOrUpdate): Promise<Collections<T>> {
    return this.$dispatch('insertOrUpdate', payload)
  }

  /**
   * Save record.
   */
  async $save<T extends Model> (this: T): Promise<Item<T>> {
    const fields = this.$self().getFields()

    const record = Object.keys(fields).reduce((record, key) => {
      if (fields[key] instanceof Attributes.Type) {
        record[key] = this[key]
      }

      return record
    }, {} as Record)

    const records = await this.$dispatch('insertOrUpdate', { data: record })

    this.$fill(records[this.$self().entity][0])

    return this
  }

  /**
   * Delete records that matches the given condition.
   */
  async $delete<T extends Model> (this: T, condition?: Payloads.Delete): Promise<Item<T> | Collection<T>> {
    if (condition) {
      return this.$dispatch('delete', condition)
    }

    if (this.$id === null) {
      return null
    }

    return this.$dispatch('delete', this.$id)
  }

  /**
   * Delete all records.
   */
  async $deleteAll (): Promise<void> {
    return this.$dispatch('deleteAll')
  }

  /**
   * Fill the model instance with the given record. If no record were passed,
   * or if the record has any missing fields, each value of the fields will
   * be filled with its default value defined at model fields definition.
   */
  $fill (record?: Record): void {
    const data = record || {}
    const fields = this.$fields()

    Object.keys(fields).forEach((key) => {
      const field = fields[key]
      const value = data[key]

      this[key] = field.make(value, data, key)
    })

    if (data.$id !== undefined) {
      this.$id = data.$id
    }
  }

  /**
   * Serialize field values into json.
   */
  $toJson (): Record {
    return Serializer.serialize(this)
  }

  /**
   * This method is used by Nuxt server-side rendering. It will prevent
   * `non-POJO` warning when using Vuex ORM with Nuxt universal mode.
   * The method is not meant to be used publicly by a user.
   *
   * See https://github.com/vuex-orm/vuex-orm/issues/255 for more detail.
   */
  toJSON (): object {
    return Object.keys(this).reduce<object>((json, key) => {
      const value = this[key]

      if (value instanceof Model) {
        json[key] = value.toJSON()

        return json
      }

      if (Array.isArray(value)) {
        json[key] = value.map(v => v instanceof Model ? v.toJSON() : v)

        return json
      }

      json[key] = value

      return json
    }, {})
  }
}
