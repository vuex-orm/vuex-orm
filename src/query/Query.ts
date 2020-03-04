import { Store } from 'vuex'
import Utils from '../support/Utils'
import Database, { Models } from '../database/Database'
import * as Data from '../data'
import Model from '../model/Model'
import State from '../modules/contracts/State'
import RootState from '../modules/contracts/RootState'
import * as Contracts from './contracts'
import * as Options from './options'
import Processor from './processors/Processor'
import Filter from './filters/Filter'
import Loader from './loaders/Loader'
import Rollcaller from './rollcallers/Rollcaller'

export type UpdateClosure = (record: Data.Record) => void

export type UpdateCondition = number | string | Contracts.Predicate | null

export type Constraint = (query: Query) => void | boolean

export type ConstraintCallback = (relationName: string) => Constraint | null

export default class Query<T extends Model = Model> {
  /**
   * The global lifecycle hook registries.
   */
  static hooks: Contracts.GlobalHooks = {}

  /**
   * The counter to generate the UID for global hooks.
   */
  static lastHookId: number = 0

  /**
   * The store instance.
   */
  store: Store<any>

  /**
   * The database instance.
   */
  database: Database

  /**
   * The entity name being queried.
   */
  entity: string

  /**
   * The entity name being queried.
   */
  baseEntity: string

  /**
   * The entity state of the Vuex Store.
   */
  state: State

  /**
   * The root state of the Vuex Store.
   */
  rootState: RootState

  /**
   * The model being queried.
   */
  model: typeof Model

  /**
   * The base model.
   */
  baseModel: typeof Model

  /**
   * This flag lets us know if current Query instance applies to
   * a base class or not (in order to know when to filter out
   * some records).
   */
  appliedOnBase: boolean = true

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
  cancelIdFilter: boolean = false

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
   * Create a new Query instance.
   */
  constructor (store: Store<any>, entity: string) {
    this.store = store
    this.database = store.$database

    this.model = this.getModel(entity)
    this.baseModel = this.getBaseModel(entity)

    this.entity = entity
    this.baseEntity = this.baseModel.entity

    this.rootState = this.database.getState()
    this.state = this.rootState[this.baseEntity]

    this.appliedOnBase = this.baseEntity === this.entity
  }

  /**
   * Delete all records from the store.
   */
  static deleteAll (store: Store<any>): void {
    const database = store.$database
    const models = database.models()

    for (const entity in models) {
      const state = database.getState()[entity]
      state && (new this(store, entity)).deleteAll()
    }
  }

  /**
   * Register a global hook. It will return ID for the hook that users may use
   * it to unregister hooks.
   */
  static on (on: string, callback: Contracts.HookableClosure): number {
    const id = ++this.lastHookId

    if (!this.hooks[on]) {
      this.hooks[on] = []
    }

    this.hooks[on].push({ id, callback })

    return id
  }

  /**
   * Unregister global hook with the given id.
   */
  static off (id: number): boolean {
    return Object.keys(this.hooks).some((on) => {
      const hooks = this.hooks[on]

      const index = hooks.findIndex(h => h.id === id)

      if (index === -1) {
        return false
      }

      hooks.splice(index, 1)

      return true
    })
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

    return (new Query(this.store, entity))
  }

  /**
   * Get model of given name from the container.
   */
  getModel (name?: string): typeof Model {
    const entity = name || this.entity

    return this.database.model(entity)
  }

  /**
   * Get all models from the container.
   */
  getModels (): Models {
    return this.database.models()
  }

  /**
   * Get base model of given name from the container.
   */
  getBaseModel (name: string): typeof Model {
    return this.database.baseModel(name)
  }

  /**
   * Returns all record of the query chain result. This method is alias
   * of the `get` method.
   */
  all (): Data.Collection<T> {
    return this.get()
  }

  /**
   * Find the record by the given id.
   */
  find (value: Options.PrimaryKey): Data.Item<T> {
    const record = this.state.data[this.normalizeIndexId(value)]

    if (!record) {
      return null
    }

    return this.item(this.hydrate(record))
  }

  /**
   * Get the record of the given array of ids.
   */
  findIn (values: Options.PrimaryKey[]): Data.Collection<T> {
    if (!Utils.isArray(values)) {
      return []
    }

    const records = values.reduce<Data.Collection<T>>((collection, value) => {
      const record = this.state.data[this.normalizeIndexId(value)]

      if (!record) {
        return collection
      }

      collection.push(this.hydrate(record))

      return collection
    }, [])

    return this.collect(records)
  }

  /**
   * Returns all record of the query chain result.
   */
  get (): Data.Collection<T> {
    const records = this.select()

    return this.collect(records)
  }

  /**
   * Returns the first record of the query chain result.
   */
  first (): Data.Item<T> {
    const records = this.select()

    if (records.length === 0) {
      return null
    }

    return this.item(this.hydrate(records[0]))
  }

  /**
   * Returns the last record of the query chain result.
   */
  last (): Data.Item<T> {
    const records = this.select()

    if (records.length === 0) {
      return null
    }

    return this.item(this.hydrate(records[records.length - 1]))
  }

  /**
   * Checks whether a result of the query chain exists.
   */
  exists (): boolean {
    const records = this.select()

    return records.length > 0
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
    // Cancel id filter usage, since "or" needs full scan.
    this.cancelIdFilter = true

    this.wheres.push({ field, value, boolean: 'or' })

    return this
  }

  /**
   * Filter records by their primary key.
   */
  whereId (value: Options.PrimaryKey): this {
    if (this.model.isCompositePrimaryKey()) {
      return this.where('$id', this.normalizeIndexId(value))
    }

    return this.where(this.model.primaryKey, value)
  }

  /**
   * Filter records by their primary keys.
   */
  whereIdIn (values: Options.PrimaryKey[]): this {
    if (this.model.isCompositePrimaryKey()) {
      const idList = values.reduce<string[]>((keys, value) => {
        return [...keys, this.normalizeIndexId(value)] as string[]
      }, [])

      return this.where('$id', idList)
    }

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
  whereFk (field: string, value: Options.PrimaryKey): this {
    const values = Utils.isArray(value) ? value : [value]

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
   * Convert value to string for composite primary keys as it expects an array.
   * Otherwise return as is.
   *
   * Throws an error when malformed value is given:
   * - Composite primary key defined on model, expects value to be array.
   * - Normal primary key defined on model, expects a primitive value.
   */
  private normalizeIndexId (value: Options.PrimaryKey): string | number {
    if (this.model.isCompositePrimaryKey()) {
      if (!Utils.isArray(value)) {
        throw new Error(
          '[Vuex ORM] Entity `' + this.entity + '` is configured with a composite ' +
          'primary key and expects an array value but instead received: ' + JSON.stringify(value)
        )
      }

      return JSON.stringify(value)
    }

    if (Utils.isArray(value)) {
      throw new Error(
        '[Vuex ORM] Entity `' + this.entity + '` expects a single value but ' +
        'instead received: ' + JSON.stringify(value)
      )
    }

    return value
  }

  /**
   * Check whether the given field is filterable through primary key
   * direct look up.
   */
  private isIdfilterable (field: any): boolean {
    return (field === this.model.primaryKey || field === '$id') && !this.cancelIdFilter
  }

  /**
   * Set id filter for the given where condition.
   */
  private setIdFilter (value: string | number | (string | number)[]): void {
    const values = Utils.isArray(value) ? value : [value]

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
  orderBy (key: Options.OrderKey, direction: Options.OrderDirection = 'asc'): this {
    this.orders.push({ key, direction })

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
  withAll (constraint: Contracts.RelationshipConstraint | null = null): this {
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
   * Get all records from the state and convert them into the array of
   * model instances.
   */
  records (): Data.Collection<T> {
    this.finalizeIdFilter()

    return this.getIdsToLookup().reduce<Data.Collection<T>>((models, id) => {
      const record = this.state.data[id]

      if (!record) {
        return models
      }

      const model = this.hydrate(record)

      // Ignore if the model is not current type of model.
      if (!this.appliedOnBase && !(this.model.entity === model.$self().entity)) {
        return models
      }

      models.push(model)

      return models
    }, [])
  }

  /**
   * Check whether if id filters should on select. If not, clear out id filter.
   */
  private finalizeIdFilter (): void {
    if (!this.cancelIdFilter || this.idFilter === null) {
      return
    }

    this.where(this.model.isCompositePrimaryKey() ? '$id' : this.model.primaryKey, Array.from(this.idFilter.values()))

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

    // Process `beforeSelect` hook.
    records = this.executeSelectHook('beforeSelect', records)

    // Let's filter the records at first by the where clauses.
    records = this.filterWhere(records)

    // Process `afterWhere` hook.
    records = this.executeSelectHook('afterWhere', records)

    // Next, lets sort the data.
    records = this.filterOrderBy(records)

    // Process `afterOrderBy` hook.
    records = this.executeSelectHook('afterOrderBy', records)

    // Finally, slice the record by limit and offset.
    records = this.filterLimit(records)

    // Process `afterLimit` hook.
    records = this.executeSelectHook('afterLimit', records)

    return records
  }

  /**
   * Filter the given data by registered where clause.
   */
  filterWhere (records: Data.Collection<T>): Data.Collection<T> {
    return Filter.where<T>(this, records)
  }

  /**
   * Sort the given data by registered orders.
   */
  filterOrderBy (records: Data.Collection<T>): Data.Collection<T> {
    return Filter.orderBy<T>(this, records)
  }

  /**
   * Limit the given records by the limit and offset.
   */
  filterLimit (records: Data.Collection<T>): Data.Collection<T> {
    return Filter.limit<T>(this, records)
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
  item (item: Data.Instance<T>): Data.Item<T> {
    if (Object.keys(this.load).length > 0) {
      Loader.eagerLoadRelations(this, [item])
    }

    return item
  }

  /**
   * Create a collection (array) from given records.
   */
  collect (collection: Data.Collection<T>): Data.Collection<T> {
    if (collection.length < 1) {
      return []
    }

    if (Object.keys(this.load).length > 0) {
      collection = collection.map<T>(item => {
        const model = this.model.getModelFromRecord(item) as typeof Model

        return new model(item) as T
      })

      Loader.eagerLoadRelations(this, collection)
    }

    return collection
  }

  /**
   * Create new data with all fields filled by default values.
   */
  new (): T {
    const model = (new this.model()).$generateId() as T

    this.commitInsert(model.$getAttributes())

    return model
  }

  /**
   * Save given data to the store by replacing all existing records in the
   * store. If you want to save data without replacing existing records,
   * use the `insert` method instead.
   */
  create (data: Data.Record | Data.Record[], options: Options.PersistOptions): Data.Collections {
    return this.persist('create', data, options)
  }

  /**
   * Create records to the state.
   */
  createRecords (records: Data.Records): Data.Collection<T> {
    this.deleteAll()

    return this.insertRecords(records)
  }

  /**
   * Insert given data to the store. Unlike `create`, this method will not
   * remove existing data within the store, but it will update the data
   * with the same primary key.
   */
  insert (data: Data.Record | Data.Record[], options: Options.PersistOptions): Data.Collections {
    return this.persist('insert', data, options)
  }

  /**
   * Insert records to the store.
   */
  insertRecords (records: Data.Records): Data.Collection<T> {
    let collection = this.mapHydrateRecords(records)

    collection = this.executeMutationHooks('beforeCreate', collection)

    this.commitInsertRecords(
      this.convertCollectionToRecords(collection)
    )

    this.executeMutationHooks('afterCreate', collection)

    return collection
  }

  /**
   * Update data in the state.
   */
  update (data: Data.Record | Data.Record[] | UpdateClosure, condition: UpdateCondition, options: Options.PersistOptions): Data.Item<T> | Data.Collection<T> | Data.Collections {
    // If the data is array, simply normalize the data and update them.
    if (Utils.isArray(data)) {
      return this.persist('update', data, options)
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
      return this.persist('update', data, options)
    }

    // Now since the condition is either String or Number, let's check if the
    // model's primary key is not a composite key. If yes, we can't set the
    // condition as ID value for the record so throw an error and abort.
    if (this.model.isCompositePrimaryKey() && !Utils.isArray(condition)) {
      throw new Error(
        '[Vuex ORM] You can\'t specify `where` value as `string` or `number` ' +
        'when you have a composite key defined in your model. Please include ' +
        'composite keys to the `data` fields.'
      )
    }

    // Finally, let's add condition as the primary key of the object and
    // then normalize them to update the records.
    return this.updateById(data, condition)
  }

  /**
   * Update all records.
   */
  updateRecords (records: Data.Records): Data.Collection<T> {
    const models = this.hydrateRecordsByMerging(records)

    return this.performUpdate(models)
  }

  /**
   * Update the state by id.
   */
  updateById (data: Data.Record | UpdateClosure, id: string | number): Data.Item<T> {
    id = typeof id === 'number' ? id.toString() : this.normalizeIndexId(id)

    const record = this.state.data[id]

    if (!record) {
      return null
    }

    const model = this.hydrate(record)

    const instances: Data.Instances<T> = {
      [id]: this.processUpdate(data, model)
    }

    this.performUpdate(instances)

    return instances[id] as Data.Item<T>
  }

  /**
   * Update the state by condition.
   */
  updateByCondition (data: Data.Record | UpdateClosure, condition: Contracts.Predicate): Data.Collection<T> {
    const instances = Object.keys(this.state.data).reduce<Data.Instances<T>>((instances, id) => {
      const instance = this.hydrate(this.state.data[id])

      if (!condition(instance)) {
        return instances
      }

      instances[id] = this.processUpdate(data, instance)

      return instances
    }, {})

    return this.performUpdate(instances)
  }

  /**
   * Update the given record with given data.
   */
  processUpdate (data: Data.Record | UpdateClosure, instance: Data.Instance<T>): Data.Instance<T> {
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
  private performUpdate (models: Data.Instances<T>): Data.Collection<T> {
    models = this.updateIndexes(models)

    const beforeHooks = this.buildHooks('beforeUpdate') as Contracts.MutationHook[]
    const afterHooks = this.buildHooks('afterUpdate') as Contracts.MutationHook[]

    const updated: Data.Collection<T> = []

    for (const id in models) {
      const model = models[id]

      if (beforeHooks.some(hook => hook(model, null, this.entity) === false)) {
        continue
      }

      this.commitInsert(model.$getAttributes())

      afterHooks.forEach(hook => { hook(model, null, this.entity) })

      updated.push(model)
    }

    return updated
  }

  /**
   * Update the key of the instances. This is needed when a user updates
   * record's primary key. We must then update the index key to
   * correspond with new id value.
   */
  private updateIndexes (instances: Data.Instances<T>): Data.Instances<T> {
    return Object.keys(instances).reduce<Data.Instances<T>>((instances, key) => {
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
  insertOrUpdate (data: Data.Record | Data.Record[], options: Options.PersistOptions): Data.Collections {
    return this.persist('insertOrUpdate', data, options)
  }

  /**
   * Insert or update the records.
   */
  insertOrUpdateRecords (records: Data.Records): Data.Collection<T> {
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
      ...this.insertRecords(toBeInserted),
      ...this.updateRecords(toBeUpdated)
    ]
  }

  /**
   * Persist data into the state while preserving it's original structure.
   */
  persist (method: Options.PersistMethods, data: Data.Record | Data.Record[], options: Options.PersistOptions): Data.Collections {
    const clonedData = Utils.cloneDeep(data)

    const normalizedData = this.normalize(clonedData)

    if (Utils.isEmpty(normalizedData)) {
      if (method === 'create') {
        this.emptyState()
      }

      return {}
    }

    return Object.entries(normalizedData).reduce<Data.Collections>((collections, [entity, records]) => {
      const newQuery = this.newQuery(entity)

      const methodForEntity = this.getPersistMethod(entity, options, method)

      const collection = newQuery.persistRecords(methodForEntity, records)

      if (collection.length > 0) {
        collections[entity] = collection
      }

      return collections
    }, {})
  }

  /**
   * Persist given records to the store by the given method.
   */
  persistRecords (method: Options.PersistMethods, records: Data.Records): Data.Collection<T> {
    switch (method) {
      case 'create':
        return this.createRecords(records)
      case 'insert':
        return this.insertRecords(records)
      case 'update':
        return this.updateRecords(records)
      case 'insertOrUpdate':
        return this.insertOrUpdateRecords(records)
    }
  }

  /**
   * Get persist method from given information.
   */
  private getPersistMethod (entity: string, options: Options.PersistOptions, fallback: Options.PersistMethods): Options.PersistMethods {
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

    return fallback
  }

  /**
   * Delete matching records with the given condition from the store.
   */
  delete (condition: string | number | (number | string)[]): Data.Item
  delete (condition: Contracts.Predicate): Data.Collection
  delete (condition: any): any {
    if (typeof condition === 'function') {
      return this.deleteByCondition(condition)
    }

    return this.deleteById(condition)
  }

  /**
   * Delete all records from the store. Even when deleting all records, we'll
   * iterate over all records to ensure that before and after hook will be
   * called for each existing records.
   */
  deleteAll (): Data.Collection {
    // If the target entity is the base entity and not inherited entity, we can
    // just delete all records.
    if (this.appliedOnBase) {
      return this.deleteByCondition(() => true)
    }

    // Otherwise, we should filter out any derived entities from being deleted
    // so we'll add such filter here.
    return this.deleteByCondition(model => model.$self().entity === this.model.entity)
  }

  /**
   * Delete a record from the store by given id.
   */
  private deleteById (id: string | number | (number | string)[]): Data.Item {
    const item = this.find(id)

    if (!item) {
      return null
    }

    return this.deleteByCondition(model => model.$id === item.$id)[0]
  }

  /**
   * Perform the actual delete query to the store.
   */
  private deleteByCondition (condition: Contracts.Predicate): Data.Collection<T> {
    let collection = this.mapHydrateAndFilterRecords(this.state.data, condition)

    collection = this.executeMutationHooks('beforeDelete', collection)

    if (collection.length === 0) {
      return []
    }

    this.commitDelete(collection.map(model => model.$id as string))

    this.executeMutationHooks('afterDelete', collection)

    return collection
  }

  /**
   * Commit mutation.
   */
  private commit (name: string, payload: any): void {
    this.store.commit(`${this.database.namespace}/${name}`, {
      entity: this.baseEntity,
      ...payload
    })
  }

  /**
   * Commit insert mutation.
   */
  private commitInsert (record: Data.Record): void {
    this.commit('insert', { record })
  }

  /**
   * Commit insert records mutation.
   */
  private commitInsertRecords (records: Data.Record): void {
    this.commit('insertRecords', { records })
  }

  /**
   * Commit delete mutation.
   */
  private commitDelete (id: string[]): void {
    this.commit('delete', { id })
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
  hydrate (record: Data.Record, forceModel?: typeof Model): Data.Instance<T> {
    if (forceModel) {
      return new forceModel(record) as T
    }

    const newModel = this.model.getModelFromRecord(record)

    if (newModel !== null) {
      return new newModel(record) as T
    }

    if (!this.appliedOnBase && record[this.model.typeKey] === undefined) {
      const typeValue = this.model.getTypeKeyValueFromModel()

      record = { ...record, [this.model.typeKey]: typeValue }

      return new this.model(record) as T
    }

    const baseModel = this.getBaseModel(this.entity)

    return new baseModel(record) as T
  }

  /**
   * Convert given records to instances by merging existing record. If there's
   * no existing record, that record will not be included in the result.
   */
  hydrateRecordsByMerging (records: Data.Records): Data.Instances<T> {
    return Object.keys(records).reduce<Data.Instances<T>>((instances, id) => {
      const recordInStore = this.state.data[id]

      if (!recordInStore) {
        return instances
      }

      const record = records[id]

      const modelForRecordInStore = this.model.getModelFromRecord(recordInStore)

      if (modelForRecordInStore === null) {
        instances[id] = this.hydrate({ ...recordInStore, ...record })

        return instances
      }

      instances[id] = this.hydrate({ ...recordInStore, ...record }, modelForRecordInStore)

      return instances
    }, {})
  }

  /**
   * Convert all given records and return it as a collection.
   */
  private mapHydrateRecords (records: Data.Records): Data.Collection<T> {
    return Utils.map(records, record => this.hydrate(record))
  }

  /**
   * Convert all given records and return it as a collection.
   */
  private mapHydrateAndFilterRecords (records: Data.Records, condition: Contracts.Predicate): Data.Collection<T> {
    const collection: Data.Collection<T> = []

    for (const key in records) {
      const model = this.hydrate(records[key])

      condition(model) && collection.push(model)
    }

    return collection
  }

  /**
   * Convert given collection to records by using index id as a key.
   */
  private convertCollectionToRecords (collection: Data.Collection<T>): Data.Records {
    return collection.reduce<Data.Records>((carry, model) => {
      carry[model['$id'] as string] = model.$getAttributes()

      return carry
    }, {})
  }

  /**
   * Clears the current state from any data related to current model.
   *
   * - Everything if not in a inheritance scheme.
   * - Only derived instances if applied to a derived entity.
   */
  private emptyState (): void {
    this.deleteAll()
  }

  /**
   * Build executable hook collection for the given hook.
   */
  private buildHooks (on: string): Contracts.HookableClosure[] {
    const hooks = this.getGlobalHookAsArray(on)

    const localHook = this.model[on] as Contracts.HookableClosure | undefined

    localHook && hooks.push(localHook.bind(this.model))

    return hooks
  }

  /**
   * Get global hook of the given name as array by stripping id key and keep
   * only hook functions.
   */
  private getGlobalHookAsArray (on: string): Contracts.HookableClosure[] {
    const hooks = this.self().hooks[on]

    return hooks ? hooks.map(h => h.callback.bind(this)) : []
  }

  /**
   * Execute mutation hooks to the given collection.
   */
  private executeMutationHooks (on: string, collection: T[]): T[] {
    const hooks = this.buildHooks(on) as Contracts.MutationHook[]

    if (hooks.length === 0) {
      return collection
    }

    return collection.filter((model) => {
      return !hooks.some(hook => hook(model, null, this.entity) === false)
    })
  }

  /**
   * Execute retrieve hook for the given method.
   */
  private executeSelectHook (on: string, models: Data.Collection<T>): Data.Collection<T> {
    const hooks = this.buildHooks(on) as Contracts.SelectHook[]

    return hooks.reduce<Data.Collection<T>>((collection, hook) => {
      collection = hook(models as any, this.entity) as any
      return collection
    }, models)
  }
}
