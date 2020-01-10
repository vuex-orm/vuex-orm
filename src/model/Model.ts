import * as Vuex from 'vuex'
import Utils from '../support/Utils'
import Uid from '../support/Uid'
import Container from '../container/Container'
import Database from '../database/Database'
import Record from '../data/Record'
import InstanceOf from '../data/InstanceOf'
import Item from '../data/Item'
import Collection from '../data/Collection'
import Collections from '../data/Collections'
import State from '../modules/contracts/State'
import * as Attributes from '../attributes'
import Mutator from '../attributes/contracts/Mutator'
import Mutators from '../attributes/contracts/Mutators'
import Predicate from '../query/contracts/Predicate'
import Query from '../query/Query'
import * as Payloads from '../modules/payloads/Actions'
import Fields from './contracts/Fields'
import FieldCache from './contracts/FieldCache'
import ModelState from './contracts/State'
import InheritanceTypes from './contracts/InheritanceTypes'
import { toAttributes, toJson } from './Serialize'

export default class Model {
  /**
   * The name that is going be used as module name in Vuex Store.
   */
  static entity: string

  /**
   * The reference to the base entity name if the class extends a base entity.
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
   * The index ID for the model.
   */
  $id: string | null = null

  /**
   * Create a new model instance.
   */
  constructor(record?: Record) {
    this.$fill(record)
  }

  /**
   * The definition of the fields of the model and its relations.
   */
  static fields(): Fields {
    return {}
  }

  /**
   * Create an attr attribute.
   */
  static attr(value: any, mutator?: Mutator<any>): Attributes.Attr {
    return new Attributes.Attr(this, value, mutator)
  }

  /**
   * Create a string attribute.
   */
  static string(
    value: any,
    mutator?: Mutator<string | null>
  ): Attributes.String {
    return new Attributes.String(this, value, mutator)
  }

  /**
   * Create a number attribute.
   */
  static number(
    value: any,
    mutator?: Mutator<number | null>
  ): Attributes.Number {
    return new Attributes.Number(this, value, mutator)
  }

  /**
   * Create a boolean attribute.
   */
  static boolean(
    value: any,
    mutator?: Mutator<boolean | null>
  ): Attributes.Boolean {
    return new Attributes.Boolean(this, value, mutator)
  }

  /**
   * Create an uid attribute.
   */
  static uid(value?: () => string | number): Attributes.Uid {
    return new Attributes.Uid(this, value)
  }

  /**
   * @deprecated Use `uid` attribute instead.
   */
  static increment(): Attributes.Uid {
    /* istanbul ignore next */
    if (__DEV__) {
      console.warn(
        '[Vuex ORM] Attribute type `increment` has been deprecated and replaced with `uid`.'
      )
    }

    return this.uid()
  }

  /**
   * Create a has one relationship.
   */
  static hasOne(
    related: typeof Model | string,
    foreignKey: string,
    localKey?: string
  ): Attributes.HasOne {
    return new Attributes.HasOne(
      this,
      related,
      foreignKey,
      this.localKey(localKey)
    )
  }

  /**
   * Create a belongs to relationship.
   */
  static belongsTo(
    parent: typeof Model | string,
    foreignKey: string,
    ownerKey?: string
  ): Attributes.BelongsTo {
    return new Attributes.BelongsTo(
      this,
      parent,
      foreignKey,
      this.relation(parent).localKey(ownerKey)
    )
  }

  /**
   * Create a has many relationship.
   */
  static hasMany(
    related: typeof Model | string,
    foreignKey: string,
    localKey?: string
  ): Attributes.HasMany {
    return new Attributes.HasMany(
      this,
      related,
      foreignKey,
      this.localKey(localKey)
    )
  }

  /**
   * Create a has many by relationship.
   */
  static hasManyBy(
    parent: typeof Model | string,
    foreignKey: string,
    ownerKey?: string
  ): Attributes.HasManyBy {
    return new Attributes.HasManyBy(
      this,
      parent,
      foreignKey,
      this.relation(parent).localKey(ownerKey)
    )
  }

  /**
   * Create a has many through relationship.
   */
  static hasManyThrough(
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
   * Create a belongs to many relationship.
   */
  static belongsToMany(
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
  static morphTo(id: string, type: string): Attributes.MorphTo {
    return new Attributes.MorphTo(this, id, type)
  }

  /**
   * Create a morph one relationship.
   */
  static morphOne(
    related: typeof Model | string,
    id: string,
    type: string,
    localKey?: string
  ): Attributes.MorphOne {
    return new Attributes.MorphOne(
      this,
      related,
      id,
      type,
      this.localKey(localKey)
    )
  }

  /**
   * Create a morph many relationship.
   */
  static morphMany(
    related: typeof Model | string,
    id: string,
    type: string,
    localKey?: string
  ): Attributes.MorphMany {
    return new Attributes.MorphMany(
      this,
      related,
      id,
      type,
      this.localKey(localKey)
    )
  }

  /**
   * Create a morph to many relationship.
   */
  static morphToMany(
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
  static morphedByMany(
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
  static mutators(): Mutators {
    return {}
  }

  /**
   * Types mapping used to dispatch entities based on their discriminator field
   */
  static types(): InheritanceTypes {
    return {}
  }

  /**
   * Get the store instance from the container.
   */
  static store(): Vuex.Store<any> {
    return Container.store
  }

  /**
   * Get the database instance from store.
   */
  static database(): Database {
    return this.store().$db()
  }

  /**
   * Create a namespaced method name for Vuex Module from the given
   * method name.
   */
  static namespace(method: string): string {
    return `${this.database().namespace}/${this.entity}/${method}`
  }

  /**
   * Call Vuex Getters.
   */
  static getters(method: string): any {
    return this.store().getters[this.namespace(method)]
  }

  /**
   * Dispatch Vuex Action.
   */
  static dispatch(method: string, payload?: any): Promise<any> {
    return this.store().dispatch(this.namespace(method), payload)
  }

  /**
   * Commit Vuex Mutation.
   */
  static commit(callback: (state: State) => void) {
    this.store().commit(`${this.database().namespace}/$mutate`, {
      entity: this.entity,
      callback
    })
  }

  /**
   * Get the Model schema definition from the cache.
   */
  static getFields(): Fields {
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
   * Get all records.
   */
  static all<T extends typeof Model>(this: T): Collection<InstanceOf<T>> {
    return this.getters('all')()
  }

  /**
   * Find a record.
   */
  static find<T extends typeof Model>(
    this: T,
    id: string | number | (number | string)[]
  ): Item<InstanceOf<T>> {
    return this.getters('find')(id)
  }

  /**
   * Get the record of the given array of ids.
   */
  static findIn<T extends typeof Model>(
    this: T,
    idList: (number | string | (number | string)[])[]
  ): Collection<InstanceOf<T>> {
    return this.getters('findIn')(idList)
  }

  /**
   * Get query instance.
   */
  static query<T extends typeof Model>(this: T): Query<InstanceOf<T>> {
    return this.getters('query')()
  }

  /**
   * Check wether the associated database contains data.
   */
  static exists<T extends typeof Model>(this: T): boolean {
    return this.query().exists()
  }

  /**
   * Create new data with all fields filled by default values.
   */
  static new(): Promise<Model> {
    return this.dispatch('new')
  }

  /**
   * Save given data to the store by replacing all existing records in the
   * store. If you want to save data without replacing existing records,
   * use the `insert` method instead.
   */
  static create<T extends typeof Model>(
    this: T,
    payload: Payloads.Create
  ): Promise<Collections> {
    return this.dispatch('create', payload)
  }

  /**
   * Insert records.
   */
  static insert<T extends typeof Model>(
    this: T,
    payload: Payloads.Insert
  ): Promise<Collections> {
    return this.dispatch('insert', payload)
  }

  /**
   * Update records.
   */
  static update<T extends typeof Model>(
    this: T,
    payload: Payloads.Update
  ): Promise<Collections> {
    return this.dispatch('update', payload)
  }

  /**
   * Insert or update records.
   */
  static insertOrUpdate<T extends typeof Model>(
    this: T,
    payload: Payloads.InsertOrUpdate
  ): Promise<Collections> {
    return this.dispatch('insertOrUpdate', payload)
  }

  /**
   * Delete records that matches the given condition.
   */
  static delete<M extends typeof Model>(
    this: M,
    id: string | number | (number | string)[]
  ): Promise<Item<InstanceOf<M>>>
  static delete<M extends typeof Model>(
    this: M,
    condition: Predicate<InstanceOf<M>>
  ): Promise<Collection<InstanceOf<M>>>
  static delete<M extends typeof Model>(this: M, payload: any): any {
    return this.dispatch('delete', payload)
  }

  /**
   * Delete all records from the store.
   */
  static deleteAll<M extends typeof Model>(
    this: M
  ): Promise<Collection<InstanceOf<M>>> {
    return this.dispatch('deleteAll')
  }

  /**
   * Check if the given key is the primary key. If the model has composite
   * primary key, this method is going to check if the given key is included
   * in the composite key.
   */
  static isPrimaryKey(key: string): boolean {
    if (!Utils.isArray(this.primaryKey)) {
      return this.primaryKey === key
    }

    return this.primaryKey.includes(key)
  }

  /**
   * Check if the primary key is a composite key.
   */
  static isCompositePrimaryKey(): boolean {
    return Utils.isArray(this.primaryKey)
  }

  /**
   * Get the id (value of primary key) from teh given record. If primary key is
   * not present, or it is invalid primary key value, which is other than
   * `string` or `number`, it's going to return `null`.
   *
   * If the model has composite key, it's going to return array of ids. If any
   * composite key missing, it will return `null`.
   */
  static getIdFromRecord(
    record: Record
  ): string | number | (string | number)[] | null {
    const key = this.primaryKey

    if (typeof key === 'string') {
      return this.getIdFromValue(record[key])
    }

    const ids = key.reduce<(string | number)[]>((keys, k) => {
      const id = this.getIdFromValue(record[k])

      id !== null && keys.push(id)

      return keys
    }, [])

    return ids.length === key.length ? ids : null
  }

  /**
   * Get correct index id, which is `string` | `number`, from the given value.
   */
  static getIdFromValue(value: any): string | number | null {
    if (typeof value === 'string' && value !== '') {
      return value
    }

    if (typeof value === 'number') {
      return value
    }

    return null
  }

  /**
   * Get the index ID value from the given record. An index ID is a value that
   * used as a key for records within the Vuex Store.
   *
   * Most of the time, it's same as the value for the Model's primary key but
   * it's always `string`, even if the primary key value is `number`.
   *
   * If the Model has a composite primary key, each value corresponding to
   * those primary key will be stringified and become a single string value
   * such as `'[1,2]'`.
   *
   * If the primary key is not present at the given record, it returns `null`.
   * For the composite primary key, every key must exist at a given record,
   * or it will return `null`.
   */
  static getIndexIdFromRecord(record: Record): string | null {
    const id = this.getIdFromRecord(record)

    if (id === null) {
      return null
    }

    if (Utils.isArray(id)) {
      return JSON.stringify(id)
    }

    return String(id)
  }

  /**
   * Get local key to pass to the attributes.
   */
  static localKey(key?: string): string {
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
    return record instanceof Model ? record.$self() : this.getTypeModel(record[this.typeKey])
  }

  /**
   * Get a model from the container.
   */
  static relation(model: typeof Model | string): typeof Model {
    if (typeof model !== 'string') {
      return model
    }

    return this.database().model(model)
  }

  /**
   * Get all `belongsToMany` fields from the schema.
   */
  static pivotFields(): {
    [key: string]:
      | Attributes.BelongsToMany
      | Attributes.MorphToMany
      | Attributes.MorphedByMany
  }[] {
    const fields: {
      [key: string]:
        | Attributes.BelongsToMany
        | Attributes.MorphToMany
        | Attributes.MorphedByMany
    }[] = []

    Utils.forOwn(this.getFields(), (field, key) => {
      if (
        field instanceof Attributes.BelongsToMany ||
        field instanceof Attributes.MorphToMany ||
        field instanceof Attributes.MorphedByMany
      ) {
        fields.push({ [key]: field })
      }
    })

    return fields
  }

  /**
   * Check if fields contains the `belongsToMany` field type.
   */
  static hasPivotFields(): boolean {
    return this.pivotFields().length > 0
  }

  /**
   * Check if the current model has a type definition
   */
  static hasTypes(): boolean {
    return Object.keys(this.types()).length > 0
  }

  /**
   * Get the model corresponding to the given type name. If it can't be found,
   * it'll return `null`.
   */
  static getTypeModel(name: string): typeof Model | null {
    const model = this.types()[name]

    if (!model) {
      return null
    }

    return model
  }

  /**
   * Given a Model, this returns the corresponding key in the InheritanceTypes mapping
   */
  static getTypeKeyValueFromModel(model?: typeof Model): string | null {
    const modelToCheck = model || this
    const types = this.types()
    for (const type in types) {
      if (types[type].entity === modelToCheck.entity) {
        return type
      }
    }
    return null
  }

  /**
   * Tries to find a Relation field in all types defined in the InheritanceTypes mapping
   */
  static findRelationInSubTypes(
    relationName: string
  ): Attributes.Relation | null {
    const types = this.types()

    for (const type in types) {
      const fields = types[type].getFields()

      for (const fieldName in fields) {
        if (
          fieldName === relationName &&
          fields[fieldName] instanceof Attributes.Relation
        ) {
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
  static hydrate(record?: Record): Record {
    return new this(record).$getAttributes()
  }

  /**
   * Get the constructor of this model.
   */
  $self(): typeof Model {
    return this.constructor as typeof Model
  }

  /**
   * Get the primary key for the model.
   */
  $primaryKey(): string | string[] {
    return this.$self().primaryKey
  }

  /**
   * The definition of the fields of the model and its relations.
   */
  $fields(): Fields {
    return this.$self().getFields()
  }

  /**
   * Set index id.
   */
  $setIndexId(id: string | null): this {
    this.$id = id

    return this
  }

  /**
   * Get the store instance from the container.
   */
  $store(): Vuex.Store<any> {
    return this.$self().store()
  }

  /**
   * Create a namespaced method name for Vuex Module from the given
   * method name.
   */
  $namespace(method: string): string {
    return this.$self().namespace(method)
  }

  /**
   * Call Vuex Getetrs.
   */
  $getters(method: string): any {
    return this.$self().getters(method)
  }

  /**
   * Dispatch Vuex Action.
   */
  async $dispatch(method: string, payload?: any): Promise<any> {
    return this.$self().dispatch(method, payload)
  }

  /**
   * Get all records.
   */
  $all<T extends Model>(this: T): Collection<T> {
    return this.$getters('all')()
  }

  /**
   * Find a record.
   */
  $find<T extends Model>(
    this: T,
    id: string | number | (number | string)[]
  ): Item<T> {
    return this.$getters('find')(id)
  }

  /**
   * Find record of the given array of ids.
   */
  $findIn<T extends Model>(
    this: T,
    idList: (number | string | (number | string)[])[]
  ): Collection<T> {
    return this.$getters('findIn')(idList)
  }

  /**
   * Get query instance.
   */
  $query(): Query {
    return this.$getters('query')()
  }

  /**
   * Create records.
   */
  async $create(payload: Payloads.Create): Promise<Collections> {
    return this.$dispatch('create', payload)
  }

  /**
   * Create records.
   */
  async $insert(payload: Payloads.Insert): Promise<Collections> {
    return this.$dispatch('insert', payload)
  }

  /**
   * Update records.
   */
  async $update(payload: Payloads.Update): Promise<Collections> {
    if (Utils.isArray(payload)) {
      return this.$dispatch('update', payload)
    }

    if (payload.where !== undefined) {
      return this.$dispatch('update', payload)
    }

    if (this.$self().getIndexIdFromRecord(payload) === null) {
      return this.$dispatch('update', {
        where: this.$self().getIdFromRecord(this),
        data: payload
      })
    }

    return this.$dispatch('update', payload)
  }

  /**
   * Insert or update records.
   */
  async $insertOrUpdate(
    payload: Payloads.InsertOrUpdate
  ): Promise<Collections> {
    return this.$dispatch('insertOrUpdate', payload)
  }

  /**
   * Save record.
   */
  async $save<T extends Model>(this: T): Promise<Item<T>> {
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
  async $delete(): Promise<Item<this>> {
    const primaryKey = this.$primaryKey()

    if (!Utils.isArray(primaryKey)) {
      return this.$dispatch('delete', this[primaryKey])
    }

    return this.$dispatch('delete', (model: this): boolean => {
      return primaryKey.every((id) => model[id] === this[id])
    })
  }

  /**
   * Delete all records.
   */
  async $deleteAll(): Promise<Collection<this>> {
    return this.$dispatch('deleteAll')
  }

  /**
   * Fill the model instance with the given record. If no record were passed,
   * or if the record has any missing fields, each value of the fields will
   * be filled with its default value defined at model fields definition.
   */
  $fill(record: Record = {}): void {
    const fields = this.$fields()

    for (const key in fields) {
      const field = fields[key]
      const value = record[key]

      this[key] = field.make(value, record, key)
    }

    // If the record contains index id, set it to the model.
    record.$id !== undefined && this.$setIndexId(record.$id)
  }

  /**
   * Generate missing primary ids and index id.
   */
  $generateId(): this {
    return this.$generatePrimaryId().$generateIndexId()
  }

  /**
   * Generate any missing primary ids.
   */
  $generatePrimaryId(): this {
    const key = this.$self().primaryKey
    const keys = Utils.isArray(key) ? key : [key]

    keys.forEach((k) => {
      if (this[k] === undefined || this[k] === null) {
        this[k] = Uid.make()
      }
    })

    return this
  }

  /**
   * Generate index id from current model attributes.
   */
  $generateIndexId(): this {
    return this.$setIndexId(this.$getIndexIdFromAttributes())
  }

  /**
   * Get index id based on current model attributes.
   */
  $getIndexIdFromAttributes(): string | null {
    return this.$self().getIndexIdFromRecord(this)
  }

  /**
   * Get all of the current attributes on the model. It includes index id
   * value as well. This method is mainly used when saving a model to
   * the store.
   */
  $getAttributes(): Record {
    return toAttributes(this)
  }

  /**
   * Serialize field values into json.
   */
  $toJson(): Record {
    return toJson(this)
  }
}
