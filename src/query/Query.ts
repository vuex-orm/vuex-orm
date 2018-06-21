import * as Vuex from 'vuex'
import Utils from '../support/Utils'
import Container from '../container/Container'
import Models from '../database/Models'
import Modules from '../database/Modules'
import { Record, Records, NormalizedData } from '../data'
import Data from '../data/Data'
import Attrs, { Fields } from '../attributes/contracts/Contract'
import Attribute from '../attributes/Attribute'
import RelationClass from '../attributes/relations/Relation'
import Model from '../model/Model'
import State from '../modules/State'
import EntityState from '../modules/EntityState'
import Hook from './Hook'
import Item from './Item'
import Collection from './Collection'
import EntityCollection from './EntityCollection'

export type WhereBoolean = 'and' | 'or'

export type WherePrimaryClosure = (record: Record, query: Query, model?: Model) => boolean | void

export type WhereSecondaryClosure = (value: any) => boolean

export type OrderDirection = 'asc' | 'desc'

export type UpdateClosure = (record: Record) => void

export type Predicate = (item: Record) => boolean

export type Condition = number | string | Predicate

export type Buildable = Record | Record[] | null

export type Constraint = (query: Query) => void | boolean

export type ConstraintCallback = (relationName: string) => Constraint | null

export interface PersistOptions {
  create?: string[]
  insert?: string[]
  update?: string[]
  insertOrUpdate?: string[]
}

export interface Wheres {
  field: string | number | WherePrimaryClosure
  value: string | number | WhereSecondaryClosure
  boolean: WhereBoolean
}

export interface Orders {
  field: string
  direction: OrderDirection
}

export interface Relation {
  name: string
  constraint: null | Constraint
}

export default class Query {
  /**
   * The root state of the Vuex Store.
   */
  rootState: State

  /**
   * The entity state of the Vuex Store.
   */
  state: EntityState

  /**
   * The entity name being queried.
   */
  entity: string

  /**
   * The model being queried.
   */
  model: typeof Model

  /**
   * The module being queried.
   */
  module: Vuex.Module<any,any>

  /**
   * The where constraints for the query.
   */
  wheres: Wheres[] = []

  /**
   * The orders of the query result.
   */
  orders: Orders[] = []

  /**
   * Number of results to skip.
   */
  _offset: number = 0

  /**
   * Maximum number of records to return.
   *
   * We use polyfill of `Number.MAX_SAFE_INTEGER` for IE11 here.
   */
  _limit: number = Math.pow(2, 53) - 1

  /**
   * The relationships that should be loaded with the result.
   */
  load: Relation[] = []

  /**
   * The lifecycle hook instance.
   */
  hook: Hook

  /**
   * Whether to wrap returing record with class or to return as plain object.
   */
  wrap: boolean

  /**
   * The Vuex Action context.
   */
  actionContext: Vuex.ActionContext<State, any> | null = null

  /**
   * Create a new Query instance.
   */
  constructor (state: State, entity: string, wrap: boolean = true) {
    this.rootState = state
    this.state = state[entity]
    this.entity = entity
    this.model = this.getModel(entity)
    this.module = this.getModule(entity)
    this.hook = new Hook(this)
    this.wrap = wrap
  }

  /**
   * Create a new query instance
   */
  static query (state: State, name: string, wrap?: boolean): Query {
    return new this(state, name, wrap)
  }

  /**
   * Get model of given name from the container.
   */
  static getModel (state: State, name: string): typeof Model {
    return Container.database(state.$name).model(name)
  }

  /**
   * Get all models from the container.
   */
  static getModels (state: State): Models {
    return Container.database(state.$name).models()
  }

  /**
   * Get module of given name from the container.
   */
  static getModule (state: State, name: string): Vuex.Module<any, any> {
    return Container.database(state.$name).module(name)
  }

  /**
   * Get all modules from the container.
   */
  static getModules (state: State): Modules {
    return Container.database(state.$name).modules()
  }

  /**
   * Save new data to the state. It will remove all existing data in the
   * state. If you want to keep existing data while saving new data,
   * use `insert` instead.
   */
  static create (state: State, entity: string, data: Record | Record[], options: PersistOptions): EntityCollection {
    return (new this(state, entity)).create(data, options)
  }

  /**
   * Commit `create` to the state.
   */
  static commitCreate (state: State, entity: string, records: Records): void {
    (new this(state, entity)).commitCreate(records)
  }

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  static insert (state: State, entity: string, data: Record | Record[], options: PersistOptions): EntityCollection {
    return (new this(state, entity)).insert(data, options)
  }

  /**
   * Commit `insert` to the state.
   */
  static commitInsert (state: State, entity: string, data: Records): void {
    (new this(state, entity)).commitInsert(data)
  }

  /**
   * Update data in the state.
   */
  static update (state: State, entity: string, data: Record | Record[] | UpdateClosure, condition?: Condition, options?: PersistOptions): Item | Collection {
    return (new this(state, entity)).update(data, condition, options)
  }

  /**
   * Commit `update` to the state.
   */
  static commitUpdate (state: State, entity: string, data: Records): void {
    (new this(state, entity)).commitUpdate(data)
  }

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  static insertOrUpdate (state: State, entity: string, data: Record | Record[], options: PersistOptions): Item | Collection {
    return (new this(state, entity)).insertOrUpdate(data, options)
  }

  /**
   * Get all data of the given entity from the state.
   */
  static all (state: State, entity: string, wrap?: boolean): Collection {
    return (new this(state, entity, wrap)).get()
  }

  /**
   * Get the record of the given id.
   */
  static find (state: State, entity: string, id: string | number, wrap?: boolean): Item {
    return (new this(state, entity, wrap)).find(id)
  }

  /**
   * Get the count of the retrieved data.
   */
  static count (state: State, entity: string, wrap?: boolean): number {
    return (new this(state, entity, wrap)).count()
  }

  /**
   * Get the max value of the specified filed.
   */
  static max (state: State, entity: string, field: string, wrap?: boolean): number {
    return (new this(state, entity, wrap)).max(field)
  }

  /**
   * Get the min value of the specified filed.
   */
  static min (state: State, entity: string, field: string, wrap?: boolean): number {
    return (new this(state, entity, wrap)).min(field)
  }

  /**
   * Delete a record from the state.
   */
  static delete (state: State, entity: string, condition: Condition): Item | Collection {
    return (new this(state, entity)).delete(condition)
  }

  /**
   * Delete all records from the state.
   */
  static deleteAll (state: State, entity?: string): Collection | void {
    if (entity) {
      return (new this(state, entity)).deleteAll()
    }

    const models = this.getModels(state)

    Utils.forOwn(models, (_model, name) => {
      state[name] && (new this(state, name)).deleteAll()
    })
  }

  /**
   * Commit `delete` to the state.
   */
  static commitDelete (state: State, entity: string, ids: string[]): void {
    (new Query(state, entity)).commitDelete(ids)
  }

  /**
   * Register a callback. It Returns unique ID for registered callback.
   */
  static on (on: string, callback: Function, once?: boolean): number {
    return Hook.on(on, callback, once)
  }

  /**
   * Remove hook registration.
   */
  static off (uid: number): boolean {
    return Hook.off(uid)
  }

  /**
   * Get query class.
   */
  self (): typeof Query {
    return this.constructor as typeof Query
  }

  /**
   * Create a new query instance.
   */
  newQuery (entity: string): Query {
    return (new Query(this.rootState, entity)).setActionContext(this.actionContext)
  }

  /**
   * Create a new query instance with wrap property set to false.
   */
  newPlainQuery (entity?: string): Query {
    entity = entity || this.entity

    return (new Query(this.rootState, entity)).plain()
  }

  /**
   * Get model of given name from the container.
   */
  getModel (name?: string): typeof Model {
    const entity = name || this.entity

    return this.self().getModel(this.rootState, entity)
  }

  /**
   * Get all models from the container.
   */
  getModels (): { [name: string]: typeof Model } {
    return this.self().getModels(this.rootState)
  }

  /**
   * Get module of given name from the container.
   */
  getModule (name?: string): Vuex.Module<any, any> {
    const entity = name || this.entity

    return this.self().getModule(this.rootState, entity)
  }

  /**
   * Get all modules from the container.
   */
  getModules (): { [name: string]: Vuex.Module<any, any> } {
    return this.self().getModules(this.rootState)
  }

  /**
   * Commit changes to the state. This method will call mutation name of
   * `method` with `payload` if the method is called from an action to
   * avoid mutating state change outside of mutation handler.
   */
  commit (method: string, payload: any, callback: Function): void {
    if (!this.actionContext) {
      callback()

      return
    }

    payload = { entity: this.entity, ...payload }

    this.actionContext.commit(`${this.rootState.$name}/${method}`, payload, { root: true })
  }

  /**
   * Set wrap flag to false.
   */
  plain (): Query {
    this.wrap = false

    return this
  }

  /**
   * Set Vuex Action Context to the query.
   */
  setActionContext (context: Vuex.ActionContext<State, any> | null): Query {
    this.actionContext = context

    return this
  }

  /**
   * Save new data to the state. It will remove all existing data in the
   * state. If you want to keep existing data while saving new data,
   * use `insert` instead.
   */
  create (data: Record | Record[], options: PersistOptions): EntityCollection {
    return this.persist(data, 'create', options)
  }

  /**
   * Create records to the state.
   */
  createMany (records: Records): Collection {
    records = this.model.hydrateMany(records)
    records = this.hook.executeOnRecords('beforeCreate', records)

    this.commitCreate(records)

    const collection = this.collect(this.records(records))

    return this.hook.executeOnCollection('afterCreate', collection)
  }

  /**
   * Commit `create` to the state.
   */
  commitCreate (data: Records): void {
    this.commit('commitCreate', { data }, () => {
      this.state.data = data
    })
  }

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert (data: Record | Record[], options: PersistOptions): EntityCollection {
    return this.persist(data, 'insert', options)
  }

  /**
   * Insert list of records in the state.
   */
  insertMany (records: Records): Collection {
    records = this.model.hydrateMany(records)
    records = this.hook.executeOnRecords('beforeCreate', records)

    this.commitInsert(records)

    const collection = this.collect(this.records(records))

    return this.hook.executeOnCollection('afterCreate', collection)
  }

  /**
   * Commit `insert` to the state.
   */
  commitInsert (data: Records): void {
    this.commit('commitInsert', { data }, () => {
      this.state.data = { ...this.state.data, ...data }
    })
  }

  /**
   * Update data in the state.
   */
  update (data: Record | Record[] | UpdateClosure, condition?: Condition, options?: PersistOptions): Item | Collection | EntityCollection {
    if (Array.isArray(data)) {
      return this.persist(data, 'update', options)
    }

    if (typeof condition === 'function') {
      return this.updateByCondition(data, condition)
    }

    if (!condition) {
      return this.persist(data, 'update', options)
    }

    return this.updateById(data, condition)
  }

  /**
   * Update all records.
   */
  updateMany (records: Records): Collection {
    let toBeUpdated: Records = {}

    records = this.model.fixMany(records, [])

    Utils.forOwn(records, (record, id) => {
      const state = this.state.data[id]

      if (!state) {
        return
      }

      const newState = JSON.parse(JSON.stringify(state))

      this.merge(record, newState)

      toBeUpdated[id] = newState
    })

    toBeUpdated = this.hook.executeOnRecords('beforeUpdate', toBeUpdated)

    this.commitUpdate(toBeUpdated)

    const collection = this.collect(this.records(toBeUpdated))

    this.hook.executeOnCollection('afterUpdate', collection)

    return collection
  }

  /**
   * Update the state by id.
   */
  updateById (data: Record | UpdateClosure, id: string | number): Item {
    id = typeof id === 'number' ? id.toString() : id

    const state = this.state.data[id]

    if (!state) {
      return null
    }

    const record = JSON.parse(JSON.stringify(state))

    typeof data === 'function' ? data(record) : this.merge(this.model.fix(data), record)

    const hookResult = this.hook.execute('beforeUpdate', record)

    if (hookResult === false) {
      return null
    }

    this.commitUpdate({ [id]: hookResult })

    const item = this.item(hookResult)

    this.hook.execute('afterUpdate', item)

    return item
  }

  /**
   * Update the state by condition.
   */
  updateByCondition (data: Record | UpdateClosure, condition: Predicate): Collection {
    let toBeUpdated: Records = {}

    Utils.forOwn(this.state.data, (record, id) => {
      if (!condition(record)) {
        return
      }

      const state = JSON.parse(JSON.stringify(record))

      typeof data === 'function' ? data(state) : this.merge(this.model.fix(data), state)

      toBeUpdated[id] = state
    })

    toBeUpdated = this.hook.executeOnRecords('beforeUpdate', toBeUpdated)

    this.commitUpdate(toBeUpdated)

    const collection = this.collect(this.records(toBeUpdated))

    this.hook.executeOnCollection('afterUpdate', collection)

    return collection
  }

  /**
   * Commit `update` to the state.
   */
  commitUpdate (data: Records): void {
    this.commit('commitUpdate', { data }, () => {
      this.state.data = { ...this.state.data, ...data }
    })
  }

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  insertOrUpdate (data: Record | Record[], options: PersistOptions): EntityCollection {
    return this.persist(data, 'insertOrUpdate', options)
  }

  /**
   * Insert or update the records.
   */
  insertOrUpdateMany (records: Records): Collection {
    let toBeInserted: Records = {}
    let toBeUpdated: Records = {}

    Utils.forOwn(records, (record, id) => {
      if (this.state.data[id]) {
        toBeUpdated[id] = record

        return
      }

      toBeInserted[id] = record
    })

    return this.collect([
      ...this.insertMany(toBeInserted),
      ...this.updateMany(toBeUpdated)
    ])
  }

  /**
   * Persist data into the state.
   */
  persist (data: Record | Record[], method: string, options: PersistOptions = {}): EntityCollection {
    data = this.normalize(data)

    if (Utils.isEmpty(data)) {
      method === 'create' && this.commitCreate({})

      return {}
    }

    return Object.keys(data).reduce((collection, entity) => {
      const query = this.newQuery(entity)
      const persistMethod = this.getPersistMethod(entity, method, options)

      const records = query[`${persistMethod}Many`](data[entity])

      if (records.length > 0) {
        collection[entity] = records
      }

      return collection
    }, {} as EntityCollection)
  }

  /**
   * Get method for the persist.
   */
  getPersistMethod (entity: string, method: string, options: PersistOptions): string {
    if (options.create && options.create.includes(entity)) {
      return 'create'
    }

    if (options.insert && options.insert.includes(entity)) {
      return 'insert'
    }

    if (options.update && options.update.includes(entity)) {
      return 'update'
    }

    if (options.insertOrUpdate && options.insertOrUpdate.includes(entity)) {
      return 'insertOrUpdate'
    }

    return method
  }

  /**
   * Normalize the given data.
   */
  normalize (data: any): NormalizedData {
    return Data.normalize(data, this)
  }

  /**
   * Update the state value by merging the given record and state.
   */
  merge (data: Record, state: Record, fields?: Fields): void {
    const theFields = fields || this.model.getFields()

    Utils.forOwn(data, (value, key) => {
      const field = theFields[key]

      if (field instanceof Attribute) {
        state[key] = value

        return
      }

      this.merge(value, state[key], field)
    })
  }

  /**
   * Returns all record of the query chain result. This method is alias
   * of the `get` method.
   */
  all (): Collection {
    return this.get()
  }

  /**
   * Get the record of the given id.
   */
  find (id: number | string): Item {
    const record = this.state.data[id]

    if (!record) {
      return null
    }

    return this.item({ ...record })
  }

  /**
   * Returns all record of the query chain result.
   */
  get (): Collection {
    const records = this.process()

    return this.collect(records)
  }

  /**
   * Returns the first record of the query chain result.
   */
  first (): Item {
    const records = this.process()

    return this.item(records[0])
  }

  /**
   * Returns the last single record of the query chain result.
   */
  last (): Item {
    const records = this.process()

    const last = records.length - 1

    return this.item(records[last])
  }

  /**
   * Get all the records from the state and convert them into the array.
   * If you pass records, it will create an array out of that records
   * instead of the store state.
   */
  records (records?: Records): Record[] {
    const theRecords = records || this.state.data

    return Object.keys(theRecords).map(id => ({ ...theRecords[id] }))
  }

  /**
   * Add a and where clause to the query.
   */
  where (field: any, value?: any): this {
    this.wheres.push({ field, value, boolean: 'and' })

    return this
  }

  /**
   * Add a or where clause to the query.
   */
  orWhere (field: any, value?: any): this {
    this.wheres.push({ field, value, boolean: 'or' })

    return this
  }

  /**
   * Add an order to the query.
   */
  orderBy (field: string, direction: OrderDirection = 'asc'): this {
    this.orders.push({ field, direction })

    return this
  }

  /**
   * Add an offset to the query.
   */
  offset (offset: number): this {
    this._offset = offset

    return this
  }

  /**
   * Add limit to the query.
   */
  limit (limit: number): this {
    this._limit = limit

    return this
  }

  /**
   * Set the relationships that should be loaded.
   */
  with (name: string, constraint: Constraint | null = null): this {
    if (name === '*') {
      this.withAll()
    } else {
      this.load.push({ name, constraint })
    }

    return this
  }

  /**
   * Query all relations.
   */
  withAll (constraints: ConstraintCallback = () => null): this {
    const fields = this.model.getFields()

    for (const field in fields) {
      if (Attrs.isRelation(fields[field])) {
        this.load.push({ name: field, constraint: constraints(field) })
      }
    }

    return this
  }

  /**
   * Query all relations recursively.
   */
  withAllRecursive (depth: number = 3): this {
    this.withAll(() => {
      return depth > 0 ? (query: Query) => {
        query.withAllRecursive(depth - 1)
      } : null
    })

    return this
  }

  /**
   * Set where constraint based on relationship existence.
   */
  has (name: string, constraint?: number | string, count?: number): this {
    return this.addHasConstraint(name, constraint, count, true)
  }

  /**
   * Set where constraint based on relationship absence.
   */
  hasNot (name: string, constraint?: number | string, count?: number): this {
    return this.addHasConstraint(name, constraint, count, false)
  }

  /**
   * Add where constraints based on has or hasNot condition.
   */
  addHasConstraint (name: string, constraint?: number | string, count?: number, existence?: boolean): this {
    const ids = this.matchesHasRelation(name, constraint, count, existence)

    this.where('$id', (value: any) => ids.includes(value))

    return this
  }

  /**
   * Add where has condition.
   */
  whereHas (name: string, constraint: Constraint): this {
    return this.addWhereHasConstraint(name, constraint, true)
  }

  /**
   * Add where has not condition.
   */
  whereHasNot (name: string, constraint: Constraint): this {
    return this.addWhereHasConstraint(name, constraint, false)
  }

  /**
   * Add where has constraints that only matches the relationship constraint.
   */
  addWhereHasConstraint (name: string, constraint: Constraint, existence?: boolean): this {
    const ids = this.matchesWhereHasRelation(name, constraint, existence)

    this.where('$id', (value: any) => ids.includes(value))

    return this
  }

  /**
   * Process the query and filter data.
   */
  process (): Record[] {
    let records: Record[] = this.records()

    // Process `beforeProcess` hook.
    records = this.hook.execute('beforeProcess', records)

    // If the where clause is registered, lets filter the records beased on it.
    if (!Utils.isEmpty(this.wheres)) {
      records = this.selectByWheres(records)
    }

    // Process `afterWhere` hook.
    records = this.hook.execute('afterWhere', records)

    // Next, lets sort the data if orderBy is registred.
    if (!Utils.isEmpty(this.orders)) {
      records = this.sortByOrders(records)
    }

    // Process `afterOrderBy` hook.
    records = this.hook.execute('afterOrderBy', records)

    // Finally, slice the record by limit and offset.
    records = records.slice(this._offset, this._offset + this._limit)

    // Process `afterLimit` hook.
    records = this.hook.execute('afterLimit', records)

    return records
  }

  /**
   * Filter the given data by registered where clause.
   */
  selectByWheres (records: Record[]): Record[] {
    return records.filter(record => this.whereOnRecord(record))
  }

  /**
   * Sort the given data by registered orders.
   */
  sortByOrders (records: Record[]): Record[] {
    const keys = this.orders.map(order => order.field)
    const directions = this.orders.map(order => order.direction)

    return Utils.orderBy(records, keys, directions)
  }

  /**
   * Checks if given Record matches the registered where clause.
   */
  whereOnRecord (record: Record): boolean {
    let whereTypes: any = Utils.groupBy(this.wheres, where => where.boolean)
    let whereResults: boolean[] = []
    let comparator: (where: any) => boolean = this.getComparator(record)

    if (whereTypes.and) {
      whereResults.push(whereTypes.and.every(comparator))
    }

    if (whereTypes.or) {
      whereResults.push(whereTypes.or.some(comparator))
    }

    return whereResults.indexOf(true) !== -1
  }

  /**
   * Get comparator for the where clause.
   */
  getComparator (record: Record): (where: any) => boolean {
    return (where: any) => {
      // Function with Record and Query as argument.
      if (typeof where.field === 'function') {
        const query = new Query(this.rootState, this.entity)
        const result = this.executeWhereClosure(record, query, where.field)

        if (typeof result === 'boolean') {
          return result
        }

        return !Utils.isEmpty(query.where('$id', record['$id']).get())
      }

      // Function with Record value as argument.
      if (typeof where.value === 'function') {
        return where.value(record[where.field])
      }

      // Check if field value is in given where Array.
      if (Array.isArray(where.value)) {
        return where.value.indexOf(record[where.field]) !== -1
      }

      // Simple equal check.
      return record[where.field] === where.value
    }
  }

  /**
   * Execute where closure.
   */
  executeWhereClosure (record: Record, query: Query, closure: WherePrimaryClosure): boolean | void {
    if (closure.length !== 3) {
      return closure(record, query)
    }

    const model = new this.model(record)

    return closure(record, query, model)
  }

  /**
   * Get the count of the retrieved data.
   */
  count (): number {
    // Do not wrap result data with class because it's unnecessary.
    this.wrap = false

    return this.get().length
  }

  /**
   * Get the max value of the specified filed.
   */
  max (field: string): number {
    // Do not wrap result data with class because it's unnecessary.
    this.wrap = false

    const numbers = this.get().reduce<number[]>((numbers, item) => {
      if (typeof item[field] === 'number') {
        numbers.push(item[field])
      }

      return numbers
    }, [])

    return numbers.length === 0 ? 0 : Math.max(...numbers)
  }

  /**
   * Get the min value of the specified filed.
   */
  min (field: string): number {
    // Do not wrap result data with class because it's unnecessary.
    this.wrap = false

    const numbers = this.get().reduce<number[]>((numbers, item) => {
      if (typeof item[field] === 'number') {
        numbers.push(item[field])
      }

      return numbers
    }, [])

    return numbers.length === 0 ? 0 : Math.min(...numbers)
  }

  /**
   * Create a item from given record.
   */
  item (item?: Record | null): Item {
    if (!item) {
      return null
    }

    if (!Utils.isEmpty(this.load)) {
      item = this.loadRelations([item])[0]
    }

    return this.model.make(item, !this.wrap)
  }

  /**
   * Create a collection (array) from given records.
   */
  collect (collection: Record[]): Collection {
    if (Utils.isEmpty(collection)) {
      return []
    }

    if (!Utils.isEmpty(this.load)) {
      collection = this.loadRelations(collection)
    }

    return collection.map(record => this.model.make(record, !this.wrap))
  }

  /**
   * Load the relationships for the record.
   */
  loadRelations (data: Record[], relation?: Relation[]): Record[] {
    const _relation = relation || this.load
    const fields = this.model.getFields()

    return _relation.reduce((records, rel) => {
      return this.processLoadRelations(records, rel, fields)
    }, data)
  }

  /**
   * Process load relationships. This method is for the circuler processes.
   */
  processLoadRelations (data: Record[], relation: Relation, fields: Fields): Record[] {
    const relationName = relation.name.split('.')[0]

    let collection: Collection = data

    Object.keys(fields).some((key) => {
      const field = fields[key]

      if (key === relationName) {
        if (field instanceof RelationClass) {
          collection = field.load(this, collection, relation)
        }

        return true
      }

      if (field instanceof Attribute) {
        return false
      }

      collection = this.processLoadRelations(collection, relation, field)

      return false
    })

    return collection
  }

  /**
   * Check if the given collection has given relationship.
   */
  matchesHasRelation (name: string, constraint?: number | string, count?: number, existence: boolean = true): string[] {
    let _constraint: (records: Record[]) => boolean

    if (constraint === undefined) {
      _constraint = record => record.length >= 1
    } else if (typeof constraint === 'number') {
      _constraint = record => record.length >= constraint
    } else if (constraint === '=' && typeof count === 'number') {
      _constraint = record => record.length === count
    } else if (constraint === '>' && typeof count === 'number') {
      _constraint = record => record.length > count
    } else if (constraint === '>=' && typeof count === 'number') {
      _constraint = record => record.length >= count
    } else if (constraint === '<' && typeof count === 'number') {
      _constraint = record => record.length < count
    } else if (constraint === '<=' && typeof count === 'number') {
      _constraint = record => record.length <= count
    }

    const data = (new Query(this.rootState, this.entity, false)).with(name).get()

    let ids: string[] = []

    data.forEach((item) => {
      const target = item[name]

      let result: boolean = false

      if (!target) {
        result = false
      } else if (Array.isArray(target) && target.length < 1) {
        result = false
      } else if (Array.isArray(target)) {
        result = _constraint(target)
      } else if (target) {
        result = _constraint([target])
      }

      if (result !== existence) {
        return
      }

      ids.push(item.$id)
    })

    return ids
  }

  /**
   * Get all id of the record that matches the relation constraints.
   */
  matchesWhereHasRelation (name: string, constraint: Constraint, existence: boolean = true): string[] {
    const data = this.newPlainQuery().with(name, constraint).get()

    let ids: string[] = []

    data.forEach((item) => {
      const target = item[name]
      const result = Array.isArray(target) ? !!target.length : !!target

      if (result !== existence) {
        return
      }

      ids.push(item.$id)
    })

    return ids
  }

  /**
   * Delete records from the state.
   */
  delete (condition: Condition): Item | Collection {
    if (typeof condition === 'function') {
      return this.deleteByCondition(condition)
    }

    return this.deleteById(condition)
  }

  /**
   * Delete a record by id.
   */
  deleteById (id: string | number): Item {
    id = typeof id === 'number' ? id.toString() : id

    const state = this.state.data[id]

    if (!state) {
      return null
    }

    const hookResult = this.hook.execute('beforeDelete', state)

    if (hookResult === false) {
      return null
    }

    this.commitDelete([id])

    const item = this.item(hookResult)

    this.hook.execute('afterDelete', item)

    return item
  }

  /**
   * Delete record by condition.
   */
  deleteByCondition (condition: Predicate): Collection {
    let toBeDeleted: Records = {}

    Utils.forOwn(this.state.data, (record, id) => {
      if (!condition(record)) {
        return
      }

      toBeDeleted[id] = record
    })

    toBeDeleted = this.hook.executeOnRecords('beforeDelete', toBeDeleted)

    this.commitDelete(Object.keys(toBeDeleted))

    const collection = this.collect(this.records(toBeDeleted))

    this.hook.executeOnCollection('afterDelete', collection)

    return collection
  }

  /**
   * Delete all records from the state.
   */
  deleteAll (): Collection {
    let toBeDeleted = this.state.data

    toBeDeleted = this.hook.executeOnRecords('beforeDelete', toBeDeleted)

    this.commitDelete(Object.keys(toBeDeleted))

    const collection = this.collect(this.records(toBeDeleted))

    this.hook.executeOnCollection('afterDelete', collection)

    return collection
  }

  /**
   * Commit `delete` to the state.
   */
  commitDelete (ids: string[]): void {
    this.commit('commitDelete', { ids }, () => {
      this.state.data = Object.keys(this.state.data).reduce((state, id) => {
        if (!ids.includes(id)) {
          state[id] = this.state.data[id]
        }

        return state
      }, {} as Record)
    })
  }
}
