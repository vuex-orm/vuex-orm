import * as Vuex from 'vuex'
import Utils from '../support/Utils'
import Container from '../container/Container'
import Database from '../database/Database'
import Models from '../database/Models'
import Modules from '../database/Modules'
import * as Data from '../data'
import Model from '../model/Model'
import State from '../modules/contracts/State'
import RootState from '../modules/contracts/RootState'
import PersistOptions from '../modules/payloads/PersistOptions'
import * as Contracts from './contracts'
import * as Options from './options'
import Processor from './processors/Processor'
import Filter from './filters/Filter'
import Loader from './loaders/Loader'
import Rollcaller from './rollcallers/Rollcaller'
import Hook from './hooks/Hook'

export type UpdateClosure = (record: Data.Record) => void

export type Predicate = (item: Data.Record) => boolean

export type UpdateCondition = number | string | Predicate | null

export type DeleteCondition = number | string | Predicate

export type Buildable = Data.Record | Data.Record[] | null

export type Constraint = (query: Query) => void | boolean

export type ConstraintCallback = (relationName: string) => Constraint | null

export default class Query<T extends Model = Model> {
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
   * Primary key ids to filter records by. It is used for filtering records
   * direct key lookup when a user is trying to fetch records by its
   * primary key.
   *
   * It should not be used if there is a logic which prevents index usage, for
   * example, an "or" condition which already requires a full scan of records.
   */
  idFilter: Set<number | string> | null = null

  /**
   * Whether to use `idFilter` key lookup. True if there is a logic which
   * prevents index usage, for example, an "or" condition which already
   * requires full scan.
   */
  cancelIdFilter: Boolean = false

  /**
   * Primary key ids to filter joined records. It is used for filtering
   * records direct key lookup. It should not be cancelled, because it
   * is free from the effects of normal where methods.
   */
  joinedIdFilter: Set<number | string> | null = null

  /**
   * The where constraints for the query.
   */
  wheres: Options.Where[] = []

  /**
   * The has constraints for the query.
   */
  have: Options.Has[] = []

  /**
   * The orders of the query result.
   */
  orders: Options.Orders[] = []

  /**
   * Number of results to skip.
   */
  offsetNumber: number = 0

  /**
   * Maximum number of records to return.
   *
   * We use polyfill of `Number.MAX_SAFE_INTEGER` for IE11 here.
   */
  limitNumber: number = Math.pow(2, 53) - 1

  /**
   * The relationships that should be eager loaded with the result.
   */
  load: Options.Load = {}

  /**
   * The lifecycle hook instance.
   */
  hook: Hook

  /**
   * This flag lets us know if current Query instance applies to
   * a base class or not (in order to know when to filter out some
   * records)
   */
  appliedOnBase: boolean = true

  /**
   * Create a new Query instance.
   */
  constructor (state: RootState, entity: string) {

    // All entitites with same base class are stored in the same state
    const baseModel = this.getBase(entity)

    this.state = state[baseModel.entity]
    this.appliedOnBase = baseModel.entity === entity

    this.rootState = state
    this.entity = entity
    this.model = this.getModel(entity)
    this.module = this.getModule(entity)
    this.hook = new Hook(this)
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
   * Get base model of given name from the container.
   */
  static getBase (name: string): typeof Model {
    return this.database().baseModel(name)
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
   * Delete all records from the state.
   */
  static deleteAll (state: RootState): void {
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
  newQuery (entity?: string): Query {
    entity = entity || this.entity

    return (new Query(this.rootState, entity))
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
   * Get base model of given name from the container.
   */
  getBase (name: string): typeof Model {
    return this.self().getBase(name)
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
   * Returns all record of the query chain result. This method is alias
   * of the `get` method.
   */
  all (): Data.Collection<T> {
    return this.get()
  }

  /**
   * Get the record of the given id.
   */
  find (id: number | string): Data.Item<T> {
    return this.item(this.state.data[id]) as Data.Item<T> // TODO: Delete "as ..." when model type coverage reaches 100%.
  }

  /**
   * Get the record of the given array of ids.
   */
  findIn (idList: Array<number | string>): Data.Collection<T> {
    return idList.map(id => this.state.data[id]).filter(item => item) as Data.Collection<T> // TODO: Delete "as ..." when model type coverage reaches 100%.
  }

  /**
   * Returns all record of the query chain result.
   */
  get (): Data.Collection<T> {
    const records = this.select()

    return this.collect(records) as Data.Collection<T> // TODO: Delete "as ..." when model type coverage reaches 100%.
  }

  /**
   * Returns the first record of the query chain result.
   */
  first (): Data.Item<T> {
    const records = this.select()

    return this.item(records[0]) as Data.Item<T> // TODO: Delete "as ..." when model type coverage reaches 100%.
  }

  /**
   * Returns the last single record of the query chain result.
   */
  last (): Data.Item<T> {
    const records = this.select()

    return this.item(records[records.length - 1]) as Data.Item<T> // TODO: Delete "as ..." when model type coverage reaches 100%.
  }

  /**
   * Add a and where clause to the query.
   */
  where (field: any, value?: any): this {
    if (this.isIdfilterable(field)) {
      this.setIdFilter(value)
    }

    this.wheres.push({ field, value, boolean: 'and' })

    return this
  }

  /**
   * Add a or where clause to the query.
   */
  orWhere (field: any, value?: any): this {
    // Cacncel id filter usage, since "or" needs full scan.
    this.cancelIdFilter = true

    this.wheres.push({ field, value, boolean: 'or' })

    return this
  }

  /**
   * Filter records by their primary key.
   */
  whereId (value: number | string): this {
    return this.where(this.model.primaryKey, value)
  }

  /**
   * Filter records by their primary keys.
   */
  whereIdIn (values: (string | number)[]): this {
    return this.where(this.model.primaryKey, values)
  }

  /**
   * Fast comparison for foreign keys. If the foreign key is the primary key,
   * it uses object lookup, fallback normal where otherwise.
   *
   * Why separate `whereFk` instead of just `where`? Additional logic needed
   * for the distinction between where and orWhere in normal queries, but
   * Fk lookups are always "and" type.
   */
  whereFk (field: string, value: string | number | (string | number)[]): this {
    const values = Array.isArray(value) ? value : [value]

    // If lookup filed is the primary key. Initialize or get intersection,
    // because boolean and could have a condition such as
    // `whereId(1).whereId(2).get()`.
    if (field === this.model.primaryKey) {
      this.setJoinedIdFilter(values)

      return this
    }

    // Else fallback to normal where.
    this.where(field, values)

    return this
  }

  /**
   * Check whether the given field and value combination is filterable through
   * primary key direct look up.
   */
  private isIdfilterable (field: any): boolean {
    return field === this.model.primaryKey && !this.cancelIdFilter
  }

  /**
   * Set id filter for the given where condition.
   */
  private setIdFilter (value: string | number | (string | number)[]): void {
    const values = Array.isArray(value) ? value : [value]

    // Initialize or get intersection, because boolean and could have a
    // condition such as `whereIdIn([1,2,3]).whereIdIn([1,2]).get()`.
    if (this.idFilter === null) {
      this.idFilter = new Set(values)

      return
    }

    this.idFilter = new Set(
      values.filter(v => (this.idFilter as Set<number | string>).has(v))
    )
  }

  /**
   * Set joined id filter for the given where condition.
   */
  private setJoinedIdFilter (values: (string | number)[]): void {
    // Initialize or get intersection, because boolean and could have a
    // condition such as `whereId(1).whereId(2).get()`.
    if (this.joinedIdFilter === null) {
      this.joinedIdFilter = new Set(values)

      return
    }

    this.joinedIdFilter = new Set(
      values.filter(v => (this.joinedIdFilter as Set<number | string>).has(v))
    )
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
    this.offsetNumber = offset

    return this
  }

  /**
   * Add limit to the query.
   */
  limit (limit: number): this {
    this.limitNumber = limit

    return this
  }

  /**
   * Set the relationships that should be loaded.
   */
  with (name: string | string[], constraint: Contracts.RelationshipConstraint | null = null): this {
    Loader.with(this, name, constraint)

    return this
  }

  /**
   * Query all relations.
   */
  withAll (): this {
    Loader.withAll(this)

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
  has (relation: string, operator?: string | number, count?: number): this {
    Rollcaller.has(this, relation, operator, count)

    return this
  }

  /**
   * Set where constraint based on relationship absence.
   */
  hasNot (relation: string, operator?: string | number, count?: number): this {
    Rollcaller.hasNot(this, relation, operator, count)

    return this
  }

  /**
   * Add where has condition.
   */
  whereHas (relation: string, constraint: Options.HasConstraint): this {
    Rollcaller.whereHas(this, relation, constraint)

    return this
  }

  /**
   * Add where has not condition.
   */
  whereHasNot (relation: string, constraint: Options.HasConstraint): this {
    Rollcaller.whereHasNot(this, relation, constraint)

    return this
  }

  /**
   * Get all records from the state and convert them into the array. It will
   * check if the record is an instance of Model and if not, it will
   * instantiate before returning them.
   *
   * This is needed to support SSR, that when the state is hydrated at server
   * side, it will be converted to the plain record at the client side.
   */
  records (): Data.Collection {
    this.finalizeIdFilter()

    return this.getIdsToLookup()
      .map((id) => {
        const model = this.state.data[id]

        // Getting the typed instance
        const hydrated = model instanceof Model ? model : this.hydrate(model)

        // And ignoring if needed
        if (!this.appliedOnBase && !(hydrated instanceof this.model)) {
          return null
        }

        return hydrated
      })
      .filter((record) => {
        return record !== null
      }) as Data.Collection
  }

  /**
   * Check whether if id filters should on select. If not, clear out id filter.
   */
  private finalizeIdFilter (): void {
    if (!this.cancelIdFilter || this.idFilter === null) {
      return
    }

    this.where(this.model.primaryKey, Array.from(this.idFilter.values()))

    this.idFilter = null
  }

  /**
   * Get a list of id that should be used to lookup when fetching records
   * from the state.
   */
  private getIdsToLookup (): (string | number)[] {
    // If both id filter and joined id filter are set, intersect them.
    if (this.idFilter && this.joinedIdFilter) {
      return Array.from(this.idFilter.values()).filter((id) => {
        return (this.joinedIdFilter as Set<number | string>).has(id)
      })
    }

    // If only either one is set, return which one is set.
    if (this.idFilter || this.joinedIdFilter) {
      return Array.from(
        (this.idFilter || this.joinedIdFilter as Set<string | number>).values()
      )
    }

    // If none is set, return all keys.
    return Object.keys(this.state.data)
  }

  /**
   * Process the query and filter data.
   */
  select (): Data.Collection<T> {
    // At first, well apply any `has` condition to the query.
    Rollcaller.applyConstraints(this)

    // Next, get all record as an array and then start filtering it through.
    let records = this.records()

    // Process `beforeProcess` hook.
    records = this.hook.executeSelectHook('beforeSelect', records)

    // Let's filter the records at first by the where clauses.
    records = this.filterWhere(records)

    // Process `afterWhere` hook.
    records = this.hook.executeSelectHook('afterWhere', records)

    // Next, lets sort the data.
    records = this.filterOrderBy(records)

    // Process `afterOrderBy` hook.
    records = this.hook.executeSelectHook('afterOrderBy', records)

    // Finally, slice the record by limit and offset.
    records = this.filterLimit(records)

    // Process `afterLimit` hook.
    records = this.hook.executeSelectHook('afterLimit', records)

    return records as Data.Collection<T> // TODO: Delete "as ..." when model type coverage reaches 100%.
  }

  /**
   * Filter the given data by registered where clause.
   */
  filterWhere (records: Data.Collection): Data.Collection {
    return Filter.where(this, records)
  }

  /**
   * Sort the given data by registered orders.
   */
  filterOrderBy (records: Data.Collection): Data.Collection {
    return Filter.orderBy(this, records)
  }

  /**
   * Limit the given records by the lmilt and offset.
   */
  filterLimit (records: Data.Collection): Data.Collection {
    return Filter.limit(this, records)
  }

  /**
   * Get the count of the retrieved data.
   */
  count (): number {
    return this.get().length
  }

  /**
   * Get the max value of the specified filed.
   */
  max (field: string): number {
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
    const numbers = this.get().reduce<number[]>((numbers, item) => {
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
    return this.get().reduce<number>((sum, item) => {
      if (typeof item[field] === 'number') {
        sum += item[field]
      }

      return sum
    }, 0)
  }

  /**
   * Create a item from given record.
   */
  item (item?: Data.Instance): Data.Item {
    if (!item) {
      return null
    }

    if (Object.keys(this.load).length > 0) {

      const model = this.model.getModelFromRecord(item) as typeof Model

      item = new model(item)

      let items = this.hook.executeSelectHook('beforeRelations', [item])
      item = items[0]

      Loader.eagerLoadRelations(this, [item])

      items = this.hook.executeSelectHook('afterRelations', [item])
      item = items[0]
    }

    return item
  }

  /**
   * Create a collection (array) from given records.
   */
  collect (collection: Data.Collection): Data.Collection {
    if (collection.length < 1) {
      return []
    }

    if (Object.keys(this.load).length > 0) {
      collection = collection.map(item => {

        const model = this.model.getModelFromRecord(item) as typeof Model
        return new model(item)
      })

      collection = this.hook.executeSelectHook('beforeRelations', collection)

      Loader.eagerLoadRelations(this, collection)

      collection = this.hook.executeSelectHook('afterRelations', collection)
    }

    return collection
  }

  /**
   * Create new data with all fields filled by default values.
   */
  new (): Model {
    const record = (new this.model()).$toJson()

    const result = this.insert(record, {})

    return result[this.entity][0]
  }

  /**
   * Save given data to the store by replacing all existing records in the
   * store. If you want to save data without replacing existing records,
   * use the `insert` method instead.
   */
  create (data: Data.Record | Data.Record[], options: PersistOptions): Data.Collections<T> {
    return this.persist(data, 'create', options) as Data.Collections<T> // TODO: Delete "as ..." when model type coverage reaches 100%.
  }

  /**
   * Create records to the state.
   */
  createMany (records: Data.Records): Data.Collection<T> {
    const instances = this.hydrateMany(records)

    const createCallback = () => {
      this.emptyState()
      this.state.data = { ...this.state.data, ...instances }
    }

    this.commit('create', instances, createCallback)

    return this.map(instances) as Data.Collection<T>  // TODO: Delete "as ..." when model type coverage reaches 100%.
  }

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert (data: Data.Record | Data.Record[], options: PersistOptions): Data.Collections<T> {
    return this.persist(data, 'insert', options) as Data.Collections<T>  // TODO: Delete "as ..." when model type coverage reaches 100%.
  }

  /**
   * Insert list of records in the state.
   */
  insertMany (records: Data.Records): Data.Collection<T> {
    const instances = this.hydrateMany(records)

    this.commit('create', instances, () => {
      this.state.data = { ...this.state.data, ...instances }
    })

    return this.map(instances) as Data.Collection<T> // TODO: Delete "as ..." when model type coverage reaches 100%.
  }

  /**
   * Update data in the state.
   */
  update (data: Data.Record | Data.Record[] | UpdateClosure, condition: UpdateCondition, options: PersistOptions): Data.Item<T> | Data.Collection<T> | Data.Collections<T> {
    // If the data is array, simply normalize the data and update them.
    if (Array.isArray(data)) {
      return this.persist(data, 'update', options) as Data.Collections<T>
    }

    // OK, the data is not an array. Now let's check `data` to see what we can
    // do if it's a closure.
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
      return this.persist(data, 'update', options) as Data.Collections<T>
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
    return this.updateById(data, condition)
  }

  /**
   * Update all records.
   */
  updateMany (records: Data.Records): Data.Collection<T> {
    const instances = this.combine(records)

    return this.commitUpdate(instances) as Data.Collection<T> // TODO: Delete "as ..." when model type coverage reaches 100%.
  }

  /**
   * Update the state by id.
   */
  updateById (data: Data.Record | UpdateClosure, id: string | number): Data.Item<T> {
    id = typeof id === 'number' ? id.toString() : id

    const instance = this.state.data[id]

    if (!instance) {
      return null
    }

    const instances: Data.Instances = {
      [id]: this.processUpdate(data, instance)
    }

    this.commitUpdate(instances)

    return instances[id] as Data.Item<T>
  }

  /**
   * Update the state by condition.
   */
  updateByCondition (data: Data.Record | UpdateClosure, condition: Predicate): Data.Collection<T> {
    const instances = Object.keys(this.state.data).reduce<Data.Instances>((instances, id) => {
      const instance = this.state.data[id]

      if (!condition(instance)) {
        return instances
      }

      instances[id] = this.processUpdate(data, instance)

      return instances
    }, {})

    return this.commitUpdate(instances) as Data.Collection<T>
  }

  /**
   * Update the given record with given data.
   */
  processUpdate (data: Data.Record | UpdateClosure, instance: Data.Instance): Data.Instance {
    if (typeof data === 'function') {
      (data as UpdateClosure)(instance)

      return instance
    }

    // When the updated instance is not the base model, we tell te hydrate what model to use
    if (instance.constructor !== this.model && instance instanceof Model) {
      return this.hydrate({ ...instance, ...data }, instance.constructor as typeof Model)
    }
    return this.hydrate({ ...instance, ...data })
  }

  /**
   * Commit `update` to the state.
   */
  commitUpdate (instances: Data.Instances): Data.Collection {
    instances = this.updateIndexes(instances)

    this.commit('update', instances, () => {
      this.state.data = { ...this.state.data, ...instances }
    })

    return this.map(instances)
  }

  /**
   * Update the key of the instances. This is needed when a user updates
   * record's primary key. We must then update the index key to
   * correspond with new id value.
   */
  private updateIndexes (instances: Data.Instances): Data.Instances {
    return Object.keys(instances).reduce<Data.Instances>((instances, key) => {
      const instance = instances[key]
      const id = String(this.model.getIndexIdFromRecord(instance))

      if (key !== id) {
        instance.$id = id

        instances[id] = instance

        delete instances[key]
      }

      return instances
    }, instances)
  }

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  insertOrUpdate (data: Data.Record | Data.Record[], options: PersistOptions): Data.Collections<T> {
    return this.persist(data, 'insertOrUpdate', options) as Data.Collections<T>  // TODO: Delete "as ..." when model type coverage reaches 100%.
  }

  /**
   * Insert or update the records.
   */
  insertOrUpdateMany (records: Data.Records): Data.Collection<T> {
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
  persist (data: Data.Record | Data.Record[], method: string, options: PersistOptions): Data.Collections {
    data = this.normalize(data)

    if (Utils.isEmpty(data)) {
      if (method === 'create') {
        this.emptyState()
      }

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
    }, {} as Data.Collections)
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
   * Delete records from the state.
   */
  delete (condition: DeleteCondition): Data.Item<T> | Data.Collection<T> {
    if (typeof condition === 'function') {
      return this.deleteByCondition(condition)
    }

    return this.deleteById(condition)
  }

  /**
   * Delete a record by id.
   */
  deleteById (id: string | number): Data.Item<T> {
    id = typeof id === 'number' ? id.toString() : id

    const instance = this.state.data[id]

    if (!instance) {
      return null
    }

    const instances = { [id]: instance }

    const collection = this.commitDelete(instances)

    return collection[0] as Data.Item<T> // TODO: Delete "as ..." when model type coverage reaches 100%.
  }

  /**
   * Delete record by condition.
   */
  deleteByCondition (condition: Predicate): Data.Collection<T> {
    const instances = Object.keys(this.state.data).reduce<Data.Instances>((records, id) => {
      const instance = this.state.data[id]

      if (!condition(instance)) {
        return records
      }

      records[id] = instance

      return records
    }, {})

    return this.commitDelete(instances) as Data.Collection<T> // TODO: Delete "as ..." when model type coverage reaches 100%.
  }

  /**
   * Delete all records from the state.
   */
  deleteAll (): void {
    let instances = this.state.data

    // If we deleting all derived entities, we need to filter out entities which
    // don't match
    if (!this.appliedOnBase) {
      instances = Object.keys(this.state.data).reduce<Data.Instances>((acc, id) => {

        if (this.state.data[id] instanceof this.model) {
          acc[id] = this.state.data[id]
        }

        return acc
      }, {})
    }

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

  /**
   * Normalize the given data.
   */
  normalize (data: Data.Record | Data.Record[]): Data.NormalizedData {
    return Processor.normalize(this, data)
  }

  /**
   * Convert given record to the model instance.
   */
  hydrate (record: Data.Record, forceModel?: typeof Model): Data.Instance {

    if (forceModel !== undefined) {
      return new forceModel(record)
    }

    let model = this.model

    if (record) {

      // If the record has the right typeKey attribute set, and Model has type mapping
      // we hydrate it as the corresponding model
      const newModel = model.getModelFromRecord(record)

      if (typeof newModel === 'function') {
        return new newModel(record)
      }

      // If we know that we're hydrating an entity which is not a base one,
      // we can set it's typeKey attribute as a "bonus"
      if (!this.appliedOnBase) {
        const typeValue = model.getTypeKeyValueFromModel()

        record[model.typeKey] = typeValue
      }
    }

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

      if (instance.constructor !== this.model && instance instanceof Model) {
        instances[id] = this.hydrate({ ...instance, ...record }, instance.constructor as typeof Model)
        return instances
      }

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

    this.hook.executeMutationHookOnRecords(`before${name}`, instances)

    callback()

    this.hook.executeMutationHookOnRecords(`after${name}`, instances)
  }

  /**
   * Clears the current state from any data related to current model:
   * - everything if not in a inheritance scheme
   * - only derived instances if applied to a derived entity
   */
  private emptyState (): void {

    if (this.appliedOnBase) {
      this.state.data = {}
      return
    }

    for (const id in this.state.data) {
      if (this.state.data[id] instanceof this.model) {
        delete this.state.data[id]
      }
    }
  }
}
