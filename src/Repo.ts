import * as _ from 'lodash'
import Container from './connections/Container'
import { Record, NormalizedData } from './Data'
import { State } from './Module'
import Model from './Model'
import Query, { Item as QueryItem, Collection as QueryCollection } from './Query'

export type Item = Model | Record | null

export type Collection = Model[] | Record[] | null

export default class Repo {
  /**
   * The base query builder instance.
   */
  protected query: Query

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
   * Create a new repo instance.
   */
  constructor (state: State, entity: string, wrap: boolean = true) {
    const model: typeof Model = this.model(state, entity)

    this.query = new Query(state, entity)

    this.entity = model
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
    return new this(state, entity, wrap).get()
  }

  /**
   * Find a data of the given entity by given id from the given state.
   */
  static find (state: State, entity: string, id: string | number, wrap: boolean = true): Item {
    return new this(state, entity, wrap).first(id)
  }

  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  static create (state: State, data: any): void {
    const normalizedData: NormalizedData = this.normalize(state, data)

    _.forEach(normalizedData, (data, entity) => {
      state[entity].data = data
    })
  }

  /**
   * Normalize the given data by given model.
   */
  static normalize (state: State, data: any): NormalizedData {
    const name: string = _.keys(data)[0]

    return this.model(state, name).normalize(data[name])
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
  model (state: State, name: string): typeof Model {
    return this.self().model(state, name)
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
   * Add a basic where clause to the query.
   */
  where (field: string, value: any): this {
    this.query.where(field, value)

    return this
  }

  /**
   * Create a item from given record.
   */
  item (item?: QueryItem): Item {
    if (!item) {
      return null
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

    if (!this.wrap) {
      return collection
    }

    return _.map(collection, data => new this.entity(data))
  }
}
