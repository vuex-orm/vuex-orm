import * as _ from '../support/lodash'
import Container from '../connections/Container'
import { Record, Records, NormalizedData } from '../Data'
import Attrs, { Fields } from './Attribute'
import Model from '../Model'
import { State } from '../Module'
import Incrementer from './Incrementer'
import Attr from './types/Attr'
import Increment from './types/Increment'
import HasOne from './relations/HasOne'
import BelongsTo from './relations/BelongsTo'
import HasMany from './relations/HasMany'
import HasManyBy from './relations/HasManyBy'
import Query, {
  Item as QueryItem,
  Collection as QueryCollection,
  OrderDirection,
  Condition
} from './Query'

export type Item = Model | Record | null

export type Collection = Model[] | Record[]

export type Buildable = QueryItem | QueryCollection | null

export type Constraint = (query: Repo) => void | boolean

export interface Relation {
  name: string
  constraint: null | Constraint
}

export default class Repo {
  /**
   * The base query builder instance.
   */
  query: Query

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
  static query (state: State, name: string, wrap: boolean = true): Repo {
    return new this(state, name, wrap)
  }

  /**
   * Get all data of the given entity from the state.
   */
  static all (state: State, entity: string, wrap: boolean = true): Collection {
    return (new this(state, entity, wrap)).get()
  }

  /**
   * Find a data of the given entity by given id from the given state.
   */
  static find (state: State, entity: string, id: string | number, wrap: boolean = true): Item {
    return (new this(state, entity, wrap)).first(id)
  }

  /**
   * Get the count of the retrieved data.
   */
  static count (state: State, entity: string, wrap: boolean = false): number {
    return (new this(state, entity, wrap)).count()
  }

  /**
   * Get the max value of the specified filed.
   */
  static max (state: State, entity: string, field: string, wrap: boolean = false): number {
    return (new this(state, entity, wrap)).max(field)
  }

  /**
   * Get the min value of the specified filed.
   */
  static min (state: State, entity: string, field: string, wrap: boolean = false): number {
    return (new this(state, entity, wrap)).min(field)
  }

  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  static create (state: State, entity: string, data: any): void {
    (new this(state, entity)).create(data)
  }

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  static insert (state: State, entity: string, data: any): void {
    (new this(state, entity)).insert(data)
  }

  /**
   * Update data in the state.
   */
  static update (state: State, entity: string, data: any, condition?: Condition): void {
    (new this(state, entity)).update(data, condition)
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
    if (!entity) {
      const models = this.models(state)

      Object.keys(models).forEach((key) => {
        const entityName = models[key].entity

        if (state[entityName]) {
          state[entityName].data = {}
        }
      })

      return
    }

    (new this(state, entity)).deleteAll()
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
   * Get the primary key for the record.
   */
  static primaryKey (state: State, name: string): string | string[] {
    return this.model(state, name).primaryKey
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
   * Get the primary key of the model.
   */
  primaryKey (): string | string[] {
    return this.self().primaryKey(this.state, this.name)
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
    this.load.push({ name, constraint })

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
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  create (data: any): void {
    this.save('create', data)
  }

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert (data: any): void {
    this.save('insert', data)
  }

  /**
   * Save data into Vuex Store.
   */
  save (method: string, data: any): void {
    const normalizedData: NormalizedData = this.normalize(data)

    // Update with empty data.
    if (method === 'create' && _.isEmpty(normalizedData)) {
      this.query[method](normalizedData)

      return
    }

    _.forEach(normalizedData, (data, entity) => {
      const incrementedData = this.setIds(
        (new Incrementer(this)).incrementFields(data, method === 'create')
      )

      const filledData = _.mapValues(incrementedData, record => this.fill(record, entity))

      entity === this.name ? (this.query as any)[method](filledData) : (new Query(this.state, entity) as any)[method](filledData)
    })
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
   * Set proper key to the records. When a record has `increment` attribute
   * type for the primary key, it's possible for the record to have the
   * key of `no_key_<count>`. This function will convert those keys into
   * the proper value of the primary key.
   */
  setIds (data: Records): Records {
    if (!this.entity.incrementFields()) {
      return data
    }

    const records: Records = {}

    _.forEach(data, (record, key) => {
      if (!_.startsWith(key, '_no_key_')) {
        records[key] = record

        return
      }

      const value = record.$id

      if (value === undefined) {
        records[key] = record

        return
      }

      records[`${value}`] = record
    })

    return records
  }

  /**
   * Fill missing fields in given data with default value defined in
   * corresponding model.
   */
  fill (data: Record, entity: string): Record {
    return this.buildRecord(data, this.model(entity).fields(), { $id: data.$id })
  }

  /**
   * Build record.
   */
  buildRecord (data: any, fields: Fields, record: Record = {}): Record {
    const newRecord: Record = record

    _.forEach(fields, (attr, name) => {
      if (Attrs.isFields(attr)) {
        const newData = data[name] ? data[name] : {}

        newRecord[name] = this.buildRecord(newData, attr, newRecord[name])

        return
      }

      if (data[name] !== undefined) {
        newRecord[name] = data[name]

        return
      }

      if (attr instanceof Attr || attr instanceof Increment) {
        newRecord[name] = attr.value

        return
      }

      if (attr instanceof HasOne || attr instanceof BelongsTo) {
        newRecord[name] = null

        return
      }

      if (attr instanceof HasMany || attr instanceof HasManyBy) {
        newRecord[name] = []

        return
      }
    })

    return newRecord
  }

  /**
   * Update data in the state.
   */
  update (data: any, condition?: Condition): void {
    if (condition) {
      this.query.update(data, condition)

      return
    }

    if (typeof this.entity.primaryKey === 'string') {
      data[this.entity.primaryKey] && this.query.update(data, data[this.entity.primaryKey])
    }
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

  /**
   * Create a item from given record.
   */
  item (queryItem: QueryItem): Item {
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
  collect (collection: QueryCollection): Collection {
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
   * Normalize the given data by given model.
   */
  normalize (data: any): NormalizedData {
    return this.model(this.name).normalize(data)
  }
}
