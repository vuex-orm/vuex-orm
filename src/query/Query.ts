import * as Vuex from 'vuex'
import Utils from '../support/Utils'
import Container from '../container/Container'
import Database from '../database/Database'
import Models from '../database/Models'
import Modules from '../database/Modules'
import * as Data from '../data'
import Attribute from '../attributes/Attribute'
import Model from '../model/Model'
import Fields from '../model/Fields'
import State from '../modules/contracts/State'
import RootState from '../modules/contracts/RootState'
import PersistOptions from '../modules/payloads/PersistOptions'
import Result from './contracts/Result'
import * as Options from './options'
import Processor from './processors/Processor'
import Filter from './filters/Filter'
import Loader from './loaders/Loader'
import Hook from './Hook'

export type UpdateClosure = (record: Data.Record) => void

export type Predicate = (item: Data.Record) => boolean

export type Condition = number | string | Predicate

export type Buildable = Data.Record | Data.Record[] | null

export type Constraint = (query: Query) => void | boolean

export type ConstraintCallback = (relationName: string) => Constraint | null

export default class Query {
  /**
   * The root state of the Vuex Store.
   */
  rootState: RootState

  /**
   * The entity state of the Vuex Store.
   */
  state: State

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
  module: Vuex.Module<State, any>

  /**
   * The where constraints for the query.
   */
  wheres: Options.Where[] = []

  /**
   * The orders of the query result.
   */
  orders: Options.Orders[] = []

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
   * The relationships that should be eager loaded with the result.
   */
  load: Options.Load = {}

  /**
   * The lifecycle hook instance.
   */
  hook: Hook

  /**
   * The object that holds mutated records. This object is used to retrieve the
   * mutated records in actions.
   *
   * Since mutations can't return any value, actions will pass an object to
   * Query through mutations, and let Query store any returning values to the
   * object. This way, actions can retrieve mutated records after committing
   * the mutations.
   */
  result: Result = { data: null }

  /**
   * Whether to wrap returing record with class or to return as plain object.
   */
  wrap: boolean

  /**
   * Create a new Query instance.
   */
  constructor (state: RootState, entity: string, wrap: boolean = true) {
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
  static query (state: RootState, name: string, wrap?: boolean): Query {
    return new this(state, name, wrap)
  }

  /**
   * Get the database from the container.
   */
  static database (): Database {
    return Container.database
  }

  /**
   * Get model of given name from the container.
   */
  static getModel (name: string): typeof Model {
    return this.database().model(name)
  }

  /**
   * Get all models from the container.
   */
  static getModels (): Models {
    return this.database().models()
  }

  /**
   * Get module of given name from the container.
   */
  static getModule (name: string): Vuex.Module<State, any> {
    return this.database().module(name)
  }

  /**
   * Get all modules from the container.
   */
  static getModules (): Modules {
    return this.database().modules()
  }

  /**
   * Save given data to the store by replacing all existing records in the
   * store. If you want to save data without replacing existing records,
   * use the `insert` method instead.
   */
  static create (state: RootState, entity: string, data: Data.Record | Data.Record[], options: PersistOptions): Data.Collections {
    return (new this(state, entity)).create(data, options)
  }

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  static insert (state: RootState, entity: string, data: Data.Record | Data.Record[], options: PersistOptions): Data.Collections {
    return (new this(state, entity)).insert(data, options)
  }

  /**
   * Update data in the state.
   */
  static update (state: RootState, entity: string, data: Data.Record | Data.Record[] | UpdateClosure, condition?: Condition, options?: PersistOptions): Data.Item | Data.Collection | Data.Collections {
    return (new this(state, entity)).update(data, condition, options)
  }

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  static insertOrUpdate (state: RootState, entity: string, data: Data.Record | Data.Record[], options: PersistOptions): Data.Collections {
    return (new this(state, entity)).insertOrUpdate(data, options)
  }

  /**
   * Get all data of the given entity from the state.
   */
  static all (state: RootState, entity: string, wrap?: boolean): Data.Collection {
    return (new this(state, entity, wrap)).get()
  }

  /**
   * Get the record of the given id.
   */
  static find (state: RootState, entity: string, id: string | number, wrap?: boolean): Data.Item {
    return (new this(state, entity, wrap)).find(id)
  }

  /**
   * Get the count of the retrieved data.
   */
  static count (state: RootState, entity: string, wrap?: boolean): number {
    return (new this(state, entity, wrap)).count()
  }

  /**
   * Get the max value of the specified filed.
   */
  static max (state: RootState, entity: string, field: string, wrap?: boolean): number {
    return (new this(state, entity, wrap)).max(field)
  }

  /**
   * Get the min value of the specified filed.
   */
  static min (state: RootState, entity: string, field: string, wrap?: boolean): number {
    return (new this(state, entity, wrap)).min(field)
  }

  /**
   * Get the sum value of the specified filed.
   */
  static sum (state: RootState, entity: string, field: string, wrap?: boolean): number {
    return (new this(state, entity, wrap)).sum(field)
  }

  /**
   * Delete a record from the state.
   */
  static delete (state: RootState, entity: string, condition: Condition): Data.Item | Data.Collection {
    return (new this(state, entity)).delete(condition)
  }

  /**
   * Delete all records from the state.
   */
  static deleteAll (state: RootState, entity?: string): Data.Collection | void {
    if (entity) {
      return (new this(state, entity)).deleteAll()
    }

    const models = this.getModels()

    Utils.forOwn(models, (_model, name) => {
      state[name] && (new this(state, name)).deleteAll()
    })
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
    return (new Query(this.rootState, entity))
  }

  /**
   * Create a new query instance with wrap property set to false.
   */
  newPlainQuery (entity?: string): Query {
    entity = entity || this.entity

    return (new Query(this.rootState, entity)).plain()
  }

  /**
   * Get the database from the container.
   */
  database (): Database {
    return this.self().database()
  }

  /**
   * Get model of given name from the container.
   */
  getModel (name?: string): typeof Model {
    const entity = name || this.entity

    return this.self().getModel(entity)
  }

  /**
   * Get all models from the container.
   */
  getModels (): Models {
    return this.self().getModels()
  }

  /**
   * Get module of given name from the container.
   */
  getModule (name?: string): Vuex.Module<State, any> {
    const entity = name || this.entity

    return this.self().getModule(entity)
  }

  /**
   * Get all modules from the container.
   */
  getModules (): Modules {
    return this.self().getModules()
  }

  /**
   * Set the result.
   */
  setResult (result: Result): this {
    this.result = result

    return this
  }

  /**
   * Set wrap flag to false.
   */
  plain (): Query {
    this.wrap = false

    return this
  }

  /**
   * Save given data to the store by replacing all existing records in the
   * store. If you want to save data without replacing existing records,
   * use the `insert` method instead.
   */
  create (data: Data.Record | Data.Record[], options: PersistOptions): Data.Collections {
    return this.persist(data, 'create', options)
  }

  /**
   * Create records to the state.
   */
  createMany (records: Data.Records): Data.Collection {
    const instances = this.hydrateMany(records)

    this.commit('create', instances, () => {
      this.state.data = instances
    })

    return this.map(instances)
  }

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert (data: Data.Record | Data.Record[], options: PersistOptions): Data.Collections {
    return this.persist(data, 'insert', options)
  }

  /**
   * Insert list of records in the state.
   */
  insertMany (records: Data.Records): Data.Collection {
    const instances = this.hydrateMany(records)

    this.commit('create', instances, () => {
      this.state.data = { ...this.state.data, ...instances }
    })

    return this.map(instances)
  }

  /**
   * Update data in the state.
   */
  update (data: Data.Record | Data.Record[] | UpdateClosure, condition?: Condition, options?: PersistOptions): Data.Item | Data.Collection | Data.Collections {
    // If the data is array, simply normalize the data and update them.
    if (Array.isArray(data)) {
      return this.persist(data, 'update', options)
    }

    // OK, the data is not an array. Now let's check `data` to see what we can
    // do if it is a closure.
    if (typeof data === 'function') {
      // If the data is closure, but if there's no condition, we wouldn't know
      // what record to update so raise an error and abort.
      if (!condition) {
        throw new Error('You must specify `where` to update records by specifying `data` as a closure.')
      }

      // If the condition is a closure, then update records by the closure.
      if (typeof condition === 'function') {
        return this.updateByCondition(data, condition)
      }

      // Else the condition is either String or Number, so let's
      // update the record by ID.
      return this.updateById(data, condition)
    }

    // Now the data is not a closure, and it's not an array, so it should be an object.
    // If the condition is closure, we can't normalize the data so let's update
    // records using the closure.
    if (typeof condition === 'function') {
      return this.updateByCondition(data, condition)
    }

    // If there's no condition, let's normalize the data and update them.
    if (!condition) {
      return this.persist(data, 'update', options)
    }

    // Now since the condition is either String or Number, let's check if the
    // model's primary key is not a composite key. If yes, we can't set the
    // condition as ID value for the record so throw an error and abort.
    if (Array.isArray(this.model.primaryKey)) {
      throw new Error(`
        You can't specify \`where\` value as \`string\` or \`number\` when you
        have a composite key defined in your model. Please include composite
        keys to the \`data\` fields.
      `)
    }

    // Finally, let's add condition as the primary key of the object and
    // then normalize them to update the records.
    data[this.model.primaryKey] = condition

    return this.persist(data, 'update', options)
  }

  /**
   * Update all records.
   */
  updateMany (records: Data.Records): Data.Collection {
    const instances = this.combine(records)

    return this.commitUpdate(instances)
  }

  /**
   * Update the state by id.
   */
  updateById (data: Data.Record | UpdateClosure, id: string | number): Data.Item {
    id = typeof id === 'number' ? id.toString() : id

    const instance = this.state.data[id]

    if (!instance) {
      return null
    }

    const instances: Data.Instances = {
      [id]: this.processUpdate(data, instance)
    }

    this.commitUpdate(instances)

    return instances[id]
  }

  /**
   * Update the state by condition.
   */
  updateByCondition (data: Data.Record | UpdateClosure, condition: Predicate): Data.Collection {
    const instances = Object.keys(this.state.data).reduce<Data.Instances>((instances, id) => {
      const instance = this.state.data[id]

      if (!condition(instance)) {
        return instances
      }

      instances[id] = this.processUpdate(data, instance)

      return instances
    }, {})

    return this.commitUpdate(instances)
  }

  /**
   * Update the given record with given data.
   */
  processUpdate (data: Data.Record | UpdateClosure, instance: Data.Instance): Data.Instance {
    if (typeof data === 'function') {
      (data as UpdateClosure)(instance)

      return instance
    }

    return this.hydrate({ ...instance, ...data })
  }

  /**
   * Commit `update` to the state.
   */
  commitUpdate (instances: Data.Instances): Data.Collection {
    this.commit('update', instances, () => {
      this.state.data = { ...this.state.data, ...instances }
    })

    return this.map(instances)
  }

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  insertOrUpdate (data: Data.Record | Data.Record[], options: PersistOptions): Data.Collections {
    return this.persist(data, 'insertOrUpdate', options)
  }

  /**
   * Insert or update the records.
   */
  insertOrUpdateMany (records: Data.Records): Data.Collection {
    let toBeInserted: Data.Records = {}
    let toBeUpdated: Data.Records = {}

    Object.keys(records).forEach((id) => {
      const record = records[id]

      if (this.state.data[id]) {
        toBeUpdated[id] = record

        return
      }

      toBeInserted[id] = record
    })

    return [
      ...this.insertMany(toBeInserted),
      ...this.updateMany(toBeUpdated)
    ]
  }

  /**
   * Persist data into the state.
   */
  persist (data: Data.Record | Data.Record[], method: string, options: PersistOptions = {}): Data.Collections {
    data = this.normalize(data)

    if (Utils.isEmpty(data)) {
      if (method === 'create') {
        this.state.data = {}
      }

      return {}
    }

    this.result.data = Object.keys(data).reduce((collection, entity) => {
      const query = this.newQuery(entity)
      const persistMethod = this.getPersistMethod(entity, method, options)

      const records = query[`${persistMethod}Many`](data[entity])

      if (records.length > 0) {
        collection[entity] = records
      }

      return collection
    }, {} as Data.Collections)

    return this.result.data
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
  normalize (data: Data.Record | Data.Record[]): Data.NormalizedData {
    return Processor.normalize(this, data)
  }

  /**
   * Update the state value by merging the given record and state.
   */
  merge (data: Data.Record, state: Data.Record, fields?: Fields): void {
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
   * Convert given record to the model instance.
   */
  hydrate (record: Data.Record): Data.Instance {
    const model = this.model

    return new model(record)
  }

  /**
   * Convert all given records to model instances.
   */
  hydrateMany (records: Data.Records): Data.Instances {
    return Object.keys(records).reduce<Data.Instances>((instances, id) => {
      const record = records[id]

      instances[id] = this.hydrate(record)

      return instances
    }, {})
  }

  /**
   * Convert given records to instances by merging existing record. If there's
   * no existing record, that record will not be included in the result.
   */
  combine (records: Data.Records): Data.Instances {
    return Object.keys(records).reduce<Data.Instances>((instances, id) => {
      const instance = this.state.data[id]

      if (!instance) {
        return instances
      }

      const record = records[id]

      instances[id] = this.hydrate({ ...instance, ...record })

      return instances
    }, {})
  }

  /**
   * Convert all given instances to collections.
   */
  map (instances: Data.Instances): Data.Collection {
    return Object.keys(instances).map(id => instances[id])
  }

  /**
   * Execute given callback by executing before and after hooks of the specified
   * method to the given instances. The method name should be something like
   * `create` or `update`, then it will be converted to `beforeCreate` ,
   * `afterCreate` and so on.
   */
  commit (method: string, instances: Data.Instances, callback: Function): void {
    const name = `${method.charAt(0).toUpperCase()}${method.slice(1)}`

    this.hook.executeOnRecords(`before${name}`, instances)

    callback()

    this.hook.executeOnRecords(`after${name}`, instances)
  }

  /**
   * Returns all record of the query chain result. This method is alias
   * of the `get` method.
   */
  all (): Data.Collection {
    return this.get()
  }

  /**
   * Get the record of the given id.
   */
  find (id: number | string): Data.Item {
    const record = this.state.data[id]

    if (!record) {
      return null
    }

    return this.item({ ...record })
  }

  /**
   * Returns all record of the query chain result.
   */
  get (): Data.Collection {
    const records = this.process()

    return this.collect(records)
  }

  /**
   * Returns the first record of the query chain result.
   */
  first (): Data.Item {
    const records = this.process()

    return this.item(records[0])
  }

  /**
   * Returns the last single record of the query chain result.
   */
  last (): Data.Item {
    const records = this.process()

    const last = records.length - 1

    return this.item(records[last])
  }

  /**
   * Get all the records from the state and convert them into the array.
   * If you pass records, it will create an array out of that records
   * instead of the store state.
   */
  records (records?: Data.Records): Data.Record[] {
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
  orderBy (field: string, direction: Options.OrderDirection = 'asc'): this {
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
  with (name: string, constraint: Options.Constraint | null = null): this {
    Loader.with(this, name, constraint)

    return this
  }

  /**
   * Query all relations.
   */
  withAll (constraint: Options.Constraint = () => null): this {
    Loader.withAll(this, constraint)

    return this
  }

  /**
   * Query all relations recursively.
   */
  withAllRecursive (depth: number = 3): this {
    Loader.withAllRecursive(this, depth)

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
  process (): Data.Record[] {
    let records: Data.Record[] = this.records()

    // Process `beforeProcess` hook.
    records = this.hook.execute('beforeProcess', records)

    // Let's filter the records at first by the where clauses.
    records = this.filterWhere(records)

    // Process `afterWhere` hook.
    records = this.hook.execute('afterWhere', records)

    // Next, lets sort the data.
    records = this.filterOrderBy(records)

    // Process `afterOrderBy` hook.
    records = this.hook.execute('afterOrderBy', records)

    // Finally, slice the record by limit and offset.
    records = this.filterLimit(records)

    // Process `afterLimit` hook.
    records = this.hook.execute('afterLimit', records)

    return records
  }

  /**
   * Filter the given data by registered where clause.
   */
  filterWhere (records: Data.Record[]): Data.Record[] {
    return Filter.where(this, records)
  }

  /**
   * Sort the given data by registered orders.
   */
  filterOrderBy (records: Data.Record[]): Data.Record[] {
    return Filter.orderBy(this, records)
  }

  /**
   * Limit the given records by the lmilt and offset.
   */
  filterLimit (records: Data.Record[]): Data.Record[] {
    return Filter.limit(this, records)
  }

  /**
   * Get the count of the retrieved data.
   */
  count (): number {
    return this.plain().get().length
  }

  /**
   * Get the max value of the specified filed.
   */
  max (field: string): number {
    const numbers = this.plain().get().reduce<number[]>((numbers, item) => {
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
    const numbers = this.plain().get().reduce<number[]>((numbers, item) => {
      if (typeof item[field] === 'number') {
        numbers.push(item[field])
      }

      return numbers
    }, [])

    return numbers.length === 0 ? 0 : Math.min(...numbers)
  }

  /**
   * Get the sum value of the specified filed.
   */
  sum (field: string): number {
    return this.plain().get().reduce<number>((sum, item) => {
      if (typeof item[field] === 'number') {
        sum += item[field]
      }

      return sum
    }, 0)
  }

  /**
   * Create a item from given record.
   */
  item (item?: Data.Record | null): Data.Item {
    if (!item) {
      return null
    }

    Loader.eagerLoadRelations(this, [item])

    return this.model.make(item, !this.wrap) as Data.Item
  }

  /**
   * Create a collection (array) from given records.
   */
  collect (collection: Data.Record[]): Data.Collection {
    if (Utils.isEmpty(collection)) {
      return []
    }

    Loader.eagerLoadRelations(this, collection)

    return collection.map(record => this.model.make(record, !this.wrap) as Model)
  }

  /**
   * Check if the given collection has given relationship.
   */
  matchesHasRelation (name: string, constraint?: number | string, count?: number, existence: boolean = true): string[] {
    let _constraint: (records: Data.Record[]) => boolean

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
  delete (condition: Condition): Data.Item | Data.Collection {
    if (typeof condition === 'function') {
      this.result.data = this.deleteByCondition(condition)

      return this.result.data
    }

    this.result.data = this.deleteById(condition)

    return this.result.data
  }

  /**
   * Delete a record by id.
   */
  deleteById (id: string | number): Data.Item {
    id = typeof id === 'number' ? id.toString() : id

    const instance = this.state.data[id]

    if (!instance) {
      return null
    }

    const instances = { [id]: instance }

    const collection = this.commitDelete(instances)

    return collection[0]
  }

  /**
   * Delete record by condition.
   */
  deleteByCondition (condition: Predicate): Data.Collection {
    const instances = Object.keys(this.state.data).reduce<Data.Instances>((records, id) => {
      const instance = this.state.data[id]

      if (!condition(instance)) {
        return records
      }

      records[id] = instance

      return records
    }, {})

    return this.commitDelete(instances)
  }

  /**
   * Delete all records from the state.
   */
  deleteAll (): void {
    const instances = this.state.data

    this.commitDelete(instances)
  }

  /**
   * Commit `delete` to the state.
   */
  commitDelete (instances: Data.Instances): Data.Collection {
    this.commit('delete', instances, () => {
      const ids = Object.keys(instances)

      this.state.data = Object.keys(this.state.data).reduce<Data.Instances>((instances, id) => {
        if (!ids.includes(id)) {
          instances[id] = this.state.data[id]
        }

        return instances
      }, {})
    })

    return this.map(instances)
  }
}
