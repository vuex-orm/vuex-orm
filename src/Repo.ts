import * as _ from './support/lodash'
import Container from './connections/Container'
import { Record, NormalizedData } from './Data'
import Attrs, { Type as AttrType, HasOne, BelongsTo, HasMany, HasManyBy } from './Attributes'
import Model, { Fields } from './Model'
import { State } from './Module'
import Query, {
  Item as QueryItem,
  Collection as QueryCollection,
  OrderDirection,
  Condition
} from './Query'

export type Item = Model | Record | null

export type Collection = Model[] | Record[]

export type Buildable = QueryItem | QueryCollection | null

export type Constraint = (query: Repo) => void

export interface Relation {
  name: string
  constraint: null | Constraint
}

export default class Repo {
  /**
   * The base query builder instance.
   */
  protected query: Query

  /**
   * The Vuex Store State.
   */
  protected state: State

  /**
   * The entity being queried.
   */
  protected entity: typeof Model

  /**
   * The name of the entity.
   */
  protected name: string

  /**
   * Whether to wrap returing record with class or to return as plain object.
   */
  protected wrap: boolean

  /**
   * The relationships that should be loaded with the result.
   */
  protected load: Relation[] = []

  /**
   * Create a new repo instance.
   */
  constructor (state: State, entity: string, wrap: boolean = true) {
    this.state = state
    this.query = new Query(state, entity)
    this.entity = this.model(entity)
    this.name = entity
    this.wrap = wrap
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
   * Get Repo class.
   */
  self (): typeof Repo {
    return this.constructor as typeof Repo
  }

  /**
   * Get model of given name from connections container.
   */
  model (name: string): typeof Model {
    return this.self().model(this.state, name)
  }

  /**
   * Get all models from connections container.
   */
  models (): { [name: string]: typeof Model } {
    return this.self().models(this.state)
  }

  /**
   * Returns single record of the query chain result.
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
  where (field: string, value: any): this {
    this.query.where(field, value)

    return this
  }

  /**
   * Add a or where clause to the query.
   */
  orWhere (field: string, value: any): this {
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
      const filledData = _.mapValues(data, record => this.fill(record, entity))

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
   * Fill missing fields in given data with default value defined in
   * corresponding model.
   */
  fill (data: Record, entity: string): Record {
    return this.buildRecord(data, this.model(entity).fields())
  }

  /**
   * Build record.
   */
  buildRecord (data: any, fields: Fields, record: Record = {}): Record {
    const newRecord: Record = record

    _.forEach(fields, (attr, name) => {
      if (Attrs.isAttrs(attr)) {
        const newData = data[name] ? data[name] : {}

        newRecord[name] = this.buildRecord(newData, attr, newRecord[name])

        return
      }

      if (data[name] !== undefined) {
        newRecord[name] = data[name]

        return
      }

      if (attr.type === AttrType.Attr) {
        newRecord[name] = attr.value

        return
      }

      if (attr.type === AttrType.HasOne || attr.type === AttrType.BelongsTo) {
        newRecord[name] = null

        return
      }

      if (attr.type === AttrType.HasMany || attr.type === AttrType.HasManyBy) {
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
    // If there is no condition, check if data contains primary key. If it has,
    // use it as a condition to update the data. Else, do nothing.
    if (!condition) {
      data[this.entity.primaryKey] && this.query.update(data, data[this.entity.primaryKey])

      return
    }

    this.query.update(data, condition)
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
  loadRelations (base: Record, record?: Record, fields?: Fields): Record {
    const _record = record || { ...base }
    const _fields = fields || this.entity.fields()

    return _.reduce(this.load, (record, relation) => {
      const name = relation.name.split('.')[0]
      const attr = _fields[name]

      if (!attr || !Attrs.isRelation(attr)) {
        _.forEach(_fields, (f: any, key: string) => {
          if (f[name]) {
            record[key] = this.loadRelations(base, record[key], f)

            return
          }
        })

        return record
      }

      if (attr.type === AttrType.Attr) {
        return record
      }

      if (attr.type === AttrType.HasOne) {
        record[name] = this.loadHasOneRelation(base, attr, relation)

        return record
      }

      if (attr.type === AttrType.BelongsTo) {
        record[name] = this.loadBelongsToRelation(base, attr, relation)

        return record
      }

      if (attr.type === AttrType.HasMany) {
        record[name] = this.loadHasManyRelation(base, attr, relation)

        return record
      }

      if (attr.type === AttrType.HasManyBy) {
        record[name] = this.loadHasManyByRelation(base, attr, relation)

        return record
      }

      return record
    }, _record)
  }

  /**
   * Load the has one relationship for the record.
   */
  loadHasOneRelation (record: Record, attr: HasOne, relation: Relation): Record | null {
    const entity: string = this.resolveRelation(attr).entity
    const field: string = attr.foreignKey

    const query = this.self().query(this.state, entity, false).where(field, record.id)

    this.addConstraint(query, relation)

    return query.first()
  }

  /**
   * Load the belongs to relationship for the record.
   */
  loadBelongsToRelation (record: Record, attr: BelongsTo, relation: Relation): Record | null {
    const entity: string = this.resolveRelation(attr).entity
    const id: number | string = record[attr.foreignKey]

    const query = this.self().query(this.state, entity, false)

    this.addConstraint(query, relation)

    return query.first(id)
  }

  /**
   * Load the has many relationship for the record.
   */
  loadHasManyRelation (record: Record, attr: HasMany, relation: Relation): Record[] | null {
    const entity: string = this.resolveRelation(attr).entity
    const field: string = attr.foreignKey

    const query = this.self().query(this.state, entity, false).where(field, record.id)

    this.addConstraint(query, relation)

    return query.get()
  }

  /**
   * Load the has many by relationship for the record.
   */
  loadHasManyByRelation (record: Record, attr: HasManyBy, relation: Relation): Record[] | null {
    const entity: string = this.resolveRelation(attr).entity
    const field: string = attr.foreignKey

    return record[field].map((id: any) => {
      const query = this.self().query(this.state, entity, false).where(attr.otherKey, id)

      this.addConstraint(query, relation)

      return query.first()
    })
  }

  /**
   * Resolve relation out of the container.
   */
  resolveRelation (attr: HasOne | BelongsTo | HasMany | HasManyBy): typeof Model {
    if (!_.isString(attr.model)) {
      return attr.model
    }

    return this.model(name)
  }

  /**
   * Add constraint to the query.
   */
  addConstraint (query: Repo, relation: Relation): void {
    const relations = relation.name.split('.')

    if (relations.length === 1) {
      relation.constraint && relation.constraint(query)

      return
    }

    relations.shift()

    query.with(relations.join('.'))
  }

  /**
   * Normalize the given data by given model.
   */
  normalize (data: any): NormalizedData {
    return this.model(this.name).normalize(data)
  }
}
