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
  protected load: string[] = []

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
  with (relation: string): this {
    this.load.push(relation)

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
      if (_.isNil(record[relation])) {
        return record
      }

      const fields: Fields = this.entity.fields()
      const attr: Attrs = fields[relation]

      if (attr.type === AttrType.Attr) {
        return record
      }

      if (attr.type === AttrType.HasOne) {
        record[relation] = this.loadHasOneRelation(record, attr as HasOne)

        return record
      }

      if (attr.type === AttrType.BelongsTo) {
        record[relation] = this.loadBelongsToRelation(record, attr as BelongsTo)

        return record
      }

      if (attr.type === AttrType.HasMany) {
        record[relation] = this.loadHasManyRelation(record, attr as HasMany)

        return record
      }

      if (attr.type === AttrType.HasManyBy) {
        record[relation] = this.loadHasManyByRelation(record, attr as HasManyBy)

        return record
      }

      return record
    }, { ...record })
  }

  /**
   * Load the has one relationship for the record.
   */
  loadHasOneRelation (record: Record, attr: HasOne): Record | null {
    const relation: string = this.resolveRelation(attr).entity
    const field: string = attr.foreignKey

    return this.self().query(this.state, relation, this.wrap).where(field, record.id).first()
  }

  /**
   * Load the belongs to relationship for the record.
   */
  loadBelongsToRelation (record: Record, attr: BelongsTo): Record | null {
    const relation: string = this.resolveRelation(attr).entity
    const id: number | string = record[attr.foreignKey]

    return this.self().query(this.state, relation, this.wrap).first(id)
  }

  /**
   * Load the has many relationship for the record.
   */
  loadHasManyRelation (record: Record, attr: HasMany): Record[] | null {
    const relation: string = this.resolveRelation(attr).entity
    const field: string = attr.foreignKey

    return this.self().query(this.state, relation, this.wrap).where(field, record.id).get()
  }

  /**
   * Load the has many by relationship for the record.
   */
  loadHasManyByRelation (record: Record, attr: HasManyBy): Record[] | null {
    const relation: string = this.resolveRelation(attr).entity
    const field: string = attr.foreignKey

    return record[field].map((id: any) => {
      return this.self().query(this.state, relation, this.wrap).where(attr.otherKey, id).first()
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
   * Normalize the given data by given model.
   */
  normalize (data: any): NormalizedData {
    return this.model(this.name).normalize(data)
  }
}
