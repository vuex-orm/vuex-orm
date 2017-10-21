import * as _ from 'lodash'
import Container from './connections/Container'
import { Record, NormalizedData } from './Data'
import { Type as AttrType, HasOne, BelongsTo, HasMany, HasManyBy } from './Attributes'
import Model, { Attrs, Fields } from './Model'
import { State } from './Module'
import Query, { Item as QueryItem, Collection as QueryCollection, OrderDirection } from './Query'

export type Item = Model | Record | null

export type Collection = Model[] | Record[] | null

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
   * Get all data of the given entity from teh state.
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
   * Get model of given name from connections container.
   */
  static model (state: State, name: string): typeof Model {
    return Container.connection(state.name).model(name)
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

    // update with empty data
    if (method === 'create' && _.isEmpty(normalizedData)) {
      (this.query as any)[method](normalizedData)
      return
    }

    _.forEach(normalizedData, (data, entity) => {
      entity === this.name ? (this.query as any)[method](data) : (new Query(this.state, entity) as any)[method](data)
    })
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
      return null
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
  loadRelations (record: Record): Record {
    return _.reduce(this.load, (record, relation) => {
      const fields: Fields = this.entity.fields()
      const name = relation.name.split('.')[0]
      const attr: Attrs = fields[name]

      if (attr.type === AttrType.Attr) {
        return record
      }

      if (attr.type === AttrType.HasOne) {
        record[name] = this.loadHasOneRelation(record, attr, relation)

        return record
      }

      if (attr.type === AttrType.BelongsTo) {
        record[name] = this.loadBelongsToRelation(record, attr, relation)

        return record
      }

      if (attr.type === AttrType.HasMany) {
        record[name] = this.loadHasManyRelation(record, attr, relation)

        return record
      }

      if (attr.type === AttrType.HasManyBy) {
        record[name] = this.loadHasManyByRelation(record, attr, relation)

        return record
      }

      return record
    }, { ...record })
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
