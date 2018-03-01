import * as _ from '../support/lodash'
import Container from '../connections/Container'
import { Record, NormalizedData, PlainItem, PlainCollection, Item, Collection } from '../data/Contract'
import Data from '../data/Data'
import Attrs, { Fields } from '../attributes/contracts/Contract'
import Model from '../model/Model'
import { State } from '../modules/Module'
import Query, { OrderDirection, Condition } from './Query'

export type Buildable = PlainItem | PlainCollection | null

export type Constraint = (query: Repo) => void | boolean

export type ConstraintCallback = (relationName: string) => Constraint | null

export interface Relation {
  name: string
  constraint: null | Constraint
}

export default class Repo {
  /**
   * The Vuex Store State.
   */
  state: State

  /**
   * The name of the entity.
   */
  name: string

  /**
   * The model of the entity.
   */
  entity: typeof Model

  /**
   * The base query builder instance.
   */
  query: Query

  /**
   * Whether to wrap returing record with class or to return as plain object.
   */
  wrap: boolean

  /**
   * The relationships that should be loaded with the result.
   */
  load: Relation[] = []

  /**
   * Create a new repo instance.
   */
  constructor (state: State, entity: string, wrap: boolean = true) {
    this.state = state
    this.name = entity
    this.entity = this.model(entity)
    this.wrap = wrap
    this.query = new Query(state, entity)
  }

  /**
   * Create a new repo instance
   */
  static query (state: State, name: string, wrap?: boolean): Repo {
    return new this(state, name, wrap)
  }

  /**
   * Get model of given name from connections container.
   */
  static model (state: State, name: string): typeof Model {
    return Container.connection(state.name).model(name)
  }

  /**
   * Get all models from connections container.
   */
  static models (state: State): { [name: string]: typeof Model } {
    return Container.connection(state.name).models()
  }

  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  static create (state: State, entity: string, data: any, insert: string[] = []): Item | Collection {
    return (new this(state, entity)).create(data, insert)
  }

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  static insert (state: State, entity: string, data: any, create: string[] = []): Item | Collection {
    return (new this(state, entity)).insert(data, create)
  }

  /**
   * Update data in the state.
   */
  static update (state: State, entity: string, data: any, condition?: Condition): Item | Collection {
    return (new this(state, entity)).update(data, condition)
  }

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  static insertOrUpdate (state: State, entity: string, data: any, create: string[] = []): Item | Collection {
    return (new this(state, entity)).insertOrUpdate(data, create)
  }

  /**
   * Get all data of the given entity from the state.
   */
  static all (state: State, entity: string, wrap?: boolean): Collection {
    return (new this(state, entity, wrap)).get()
  }

  /**
   * Find a data of the given entity by given id from the given state.
   */
  static find (state: State, entity: string, id: string | number, wrap?: boolean): Item {
    return (new this(state, entity, wrap)).first(id)
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
   * Delete data from the state.
   */
  static delete (state: State, entity: string, condition: Condition): void {
    (new this(state, entity)).delete(condition)
  }

  /**
   * Delete all data from the state.
   */
  static deleteAll (state: State, entity?: string): void {
    if (entity) {
      (new this(state, entity)).deleteAll()
    }

    const models = this.models(state)

    _.forEach(models, (_model, name) => {
      state[name] && (new Query(state, name)).deleteAll()
    })
  }

  /**
   * Get Repo class.
   */
  self (): typeof Repo {
    return this.constructor as typeof Repo
  }

  /**
   * Get model of given name from connections container.
   */
  model (name?: string): typeof Model {
    const entity = name || this.name

    return this.self().model(this.state, entity)
  }

  /**
   * Get all models from connections container.
   */
  models (): { [name: string]: typeof Model } {
    return this.self().models(this.state)
  }

  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  create (data: any, insert: string[] = []): Item | Collection {
    return this.persist('create', data, [], insert)
  }

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert (data: any, create: string[] = []): Item | Collection {
    return this.persist('insert', data, create, [])
  }

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  insertOrUpdate (data: any, create: string[] = []): Item | Collection {
    const normalizedData: NormalizedData = this.normalize(data)
    const toBePersisted: NormalizedData = {}
    const updatedItems: string[] = []
    let persistedItems: (string | number)[] = []

    // `normalizedData` contains the differenty entity types (e.g. `users`),
    _.forEach(normalizedData, (data, entity) => {
      const repo = new Repo(this.state, entity, false)

      // `data` contains the items of `entity`.
      _.forEach(data, (item, id) => {
        // Check if item does not already exist in store and mark it as new.
        if (repo.entity.id(item) === undefined || repo.find(repo.entity.id(item)) === null) {
          if (!toBePersisted.hasOwnProperty(entity)) {
            toBePersisted[entity] = {}
          }

          toBePersisted[entity][id] = item
        } else {
          repo.query.update(item, repo.entity.id(item))
          updatedItems.push(repo.entity.id(item))
        }
      })
    })

    if (Object.keys(toBePersisted).length > 0) {
      persistedItems = this.processPersist('insert', toBePersisted, create, [])
    }

    // merging the ids of updated and persisted items to return all of them.
    return this.getReturnData([...updatedItems, ...persistedItems])
  }

  /**
   * Persist data into Vuex Store.
   */
  persist (method: string, data: any, forceCreateFor: string[] = [], forceInsertFor: string[] = []): Item | Collection {
    const normalizedData = this.normalize(data)

    if (_.isEmpty(normalizedData)) {
      method === 'create' && this.query.create({})

      return null
    }

    const items = this.processPersist(method, normalizedData, forceCreateFor, forceInsertFor)

    return this.getReturnData(items)
  }

  /**
   * Persist data into the store. It returns list of created ids.
   */
  processPersist (defaultMethod: string, data: NormalizedData, forceCreateFor: string[] = [], forceInsertFor: string[] = []): (string | number)[] {
    const items: (string | number)[] = []

    const records = Data.fillAll(data, this)

    _.forEach(records, (data, entity) => {
      const method = this.getPersistMethod(defaultMethod, entity, forceCreateFor, forceInsertFor)

      if (entity !== this.name) {
        (new Query(this.state, entity) as any)[method](data)

        return
      }

      (this.query as any)[method](data)

      _.forEach(data, item => { items.push(item.$id) })
    })

    return items
  }

  /**
   * Normalize the given data.
   */
  normalize (data: any): NormalizedData {
    return Data.normalize(data, this)
  }

  /**
   * Get method for persist.
   */
  getPersistMethod (defaultMethod: string, entity: string, forceCreateFor: string[] = [], forceInsertFor: string[] = []): string {
    if (_.includes(forceCreateFor, entity)) {
      return 'create'
    }

    if (_.includes(forceInsertFor, entity)) {
      return 'insert'
    }

    return defaultMethod
  }

  /**
   * Get all data that should be retunred.
   */
  getReturnData (items: (string | number)[]): Item | Collection {
    if (items.length === 0) {
      return null
    }

    const method = items.length > 1 ? 'get' : 'first'

    return new Repo(this.state, this.name).where('$id', (value: any) => {
      return _.includes(items, value)
    })[method]()
  }

  /**
   * Get all data that should be retunred. This method will always return
   * array of data even there's only a single item.
   */
  getManyReturnData (items: (string | number)[]): Item | Collection {
    if (items.length === 0) {
      return []
    }

    return new Repo(this.state, this.name).where('$id', (value: any) => {
      return _.includes(items, value)
    }).get()
  }

  /**
   * Update data in the state.
   */
  update (data: any, condition?: Condition): Item | Collection {
    if (!condition) {
      return this.processUpdateById(data, this.entity.id(data))
    }

    if (typeof condition === 'number' || typeof condition === 'string') {
      return this.processUpdateById(data, condition)
    }

    return this.processUpdateByCondition(data, condition)
  }

  /**
   * Update data by id.
   */
  processUpdateById (data: any, id?: any): Item | Collection {
    const items: any[] = []

    if (id !== undefined) {
      this.query.update(data, id)

      items.push(id)
    }

    return this.getReturnData(items)
  }

  /**
   * Update data by id.
   */
  processUpdateByCondition (data: any, condition: (record: Record) => boolean): Item | Collection {
    const records = (new Repo(this.state, this.name, false)).where(condition).get()

    const items = _.map(records, record => this.entity.id(record))

    this.query.update(data, condition)

    return this.getManyReturnData(items)
  }

  /**
   * Returns all record of the query chain result. This method is alias
   * of the `get` method.
   */
  all (): Collection {
    return this.get()
  }

  /**
   * Returns single record of the query chain result. This method is alias
   * of the `first` method.
   */
  find (id: number | string): Item {
    return this.first(id)
  }

  /**
   * Returns all record of the query chain result.
   */
  get (): Collection {
    return this.collect(this.query.get())
  }

  /**
   * Returns single record of the query chain result.
   */
  first (id?: number | string): Item {
    return this.item(this.query.first(id))
  }

  /**
   * Returns the last single record of the query chain result.
   */
  last (): Item {
    return this.item(this.query.last())
  }

  /**
   * Add a and where clause to the query.
   */
  where (field: any, value?: any): this {
    this.query.where(field, value)

    return this
  }

  /**
   * Add a or where clause to the query.
   */
  orWhere (field: any, value?: any): this {
    this.query.orWhere(field, value)

    return this
  }

  /**
   * Add an order to the query.
   */
  orderBy (field: string, direction: OrderDirection = 'asc'): this {
    this.query.orderBy(field, direction)

    return this
  }

  /**
   * Add an offset to the query.
   */
  offset (offset: number): this {
    this.query.offset(offset)

    return this
  }

  /**
   * Add limit to the query.
   */
  limit (limit: number): this {
    this.query.limit(limit)

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
    const fields = this.entity.fields()

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
      return depth > 0 ? (query: Repo) => {
        query.withAllRecursive(depth - 1)
      } : null
    })

    return this
  }

  /**
   * Set where constraint based on relationship existence.
   */
  has (name: string, constraint: number | string | Constraint | null = null, count?: number): this {
    return this.addHasConstraint(name, constraint, count, true)
  }

  /**
   * Set where constraint based on relationship absence.
   */
  hasNot (name: string, constraint: number | string | Constraint | null = null, count?: number): this {
    return this.addHasConstraint(name, constraint, count, false)
  }

  /**
   * Add where constraints based on has or hasNot condition.
   */
  addHasConstraint (name: string, constraint: number | string | Constraint | null = null, count?: number, existence: boolean = true): this {
    const ids: any[] = []
    const items = (new Query(this.state, this.name)).get()

    _.forEach(items, (item) => {
      const id = this.entity.id(item)

      this.hasRelation(item, name, constraint, count) === existence && ids.push(id)
    })

    this.where('$id', (key: any) => _.includes(ids, key))

    return this
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

    const record = _.maxBy(this.get(), field)

    return record ? record[field] : 0
  }

  /**
   * Get the min value of the specified filed.
   */
  min (field: string): number {
    // Do not wrap result data with class because it's unnecessary.
    this.wrap = false

    const record = _.minBy(this.get(), field)

    return record ? record[field] : 0
  }

  /**
   * Create a item from given record.
   */
  item (queryItem: PlainItem): Item {
    if (!queryItem) {
      return null
    }

    let item: Item = queryItem

    if (!_.isEmpty(this.load)) {
      item = this.loadRelations(item)
    }

    if (!this.wrap) {
      return item
    }

    return new this.entity(item)
  }

  /**
   * Create a collection (array) from given records.
   */
  collect (collection: PlainCollection): Collection {
    if (_.isEmpty(collection)) {
      return []
    }

    let item: Collection = collection

    if (!_.isEmpty(this.load)) {
      item = _.map(item, data => this.loadRelations(data))
    }

    if (!this.wrap) {
      return item
    }

    return _.map(item, data => new this.entity(data))
  }

  /**
   * Load the relationships for the record.
   */
  loadRelations (base: Record, load?: Relation[], record?: Record, fields?: Fields): Record {
    const _load = load || this.load
    const _record = record || { ...base }
    const _fields = fields || this.entity.fields()

    return _.reduce(_load, (record, relation) => {
      const name = relation.name.split('.')[0]
      const attr = _fields[name]

      if (!attr || !Attrs.isAttribute(attr)) {
        _.forEach(_fields, (f: any, key: string) => {
          if (f[name]) {
            record[key] = this.loadRelations(base, _load, record[key], f)

            return
          }
        })

        return record
      }

      if (Attrs.isRelation(attr)) {
        record[name] = attr.load(this, base, relation)

        return record
      }

      return record
    }, _record)
  }

  /**
   * Check if the given record has given relationship.
   */
  hasRelation (record: Record, name: string, constraint: number | string | Constraint | null = null, count?: number): boolean {
    let _constraint = constraint

    if (typeof constraint === 'number') {
      _constraint = query => query.count() === constraint
    } else if (constraint === '>' && typeof count === 'number') {
      _constraint = query => query.count() > count
    } else if (constraint === '>=' && typeof count === 'number') {
      _constraint = query => query.count() >= count
    } else if (constraint === '<' && typeof count === 'number') {
      _constraint = query => query.count() < count
    } else if (constraint === '<=' && typeof count === 'number') {
      _constraint = query => query.count() <= count
    }

    const data = this.loadRelations(record, [{ name, constraint: (_constraint as Constraint) }])

    return !_.isEmpty(data[name])
  }

  /**
   * Delete data from the state.
   */
  delete (condition: Condition): void {
    this.query.delete(condition)
  }

  /**
   * Delete all data from the state.
   */
  deleteAll (): void {
    this.query.deleteAll()
  }
}
