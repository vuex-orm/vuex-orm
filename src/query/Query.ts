import { Store } from 'vuex'
import { isEmpty, groupBy } from '../support/Utils'
import { Record, Item, Collection } from '../data/Data'
import Model from '../model/Model'
import Constructor from '../model/Constructor'
import Connection from '../connection/Connection'
import * as Options from './options/Options'

export default class Query<M extends Model> {
  /**
   * The store instance.
   */
  store: Store<any>

  /**
   * The model object.
   */
  model: Constructor<M>

  /**
   * The where constraints for the query.
   */
  wheres: Options.Where[] = []

  /**
   * Create a new query instance.
   */
  constructor(store: Store<any>, model: Constructor<M>) {
    this.store = store
    this.model = model
  }

  /**
   * Create a new connection instance.
   */
  connection(): Connection<M> {
    return new Connection(this.store, this.model)
  }

  /**
   * Add a basic where clause to the query.
   */
  where(field: string, value: any): this {
    this.wheres.push({ field, value, boolean: 'and' })

    return this
  }

  /**
   * Add an "or where" clause to the query.
   */
  orWhere(field: string, value: any): Query<M> {
    this.wheres.push({ field, value, boolean: 'or' })

    return this
  }

  /**
   * Retrieve models by processing whole query chain.
   */
  get(): Collection<M> {
    return this.select()
  }

  /**
   * Find a model by its primary key.
   */
  find(id: string | number): Item<M> {
    const indexId = this.normalizeIndexId(id)

    const record = this.connection().find(indexId)

    return record ? this.hydrateRecord(record) : null
  }

  /**
   * Find multiple models by their primary keys.
   */
  findIn(ids: (string | number)[]): Collection<M> {
    const indexIds = this.normalizeIndexIds(ids)

    const records = this.connection().findIn(indexIds)

    return this.hydrateRecords(records)
  }

  /**
   * Get all models from the state. The difference with the `get` is that this
   * method will not process any query chain. It'll always retrieve all models.
   */
  getModels(): Collection<M> {
    const records = this.connection().get()

    const collection = [] as Collection<M>

    for (const id in records) {
      collection.push(this.hydrateRecord(records[id]))
    }

    return collection
  }

  /**
   * Retrieve models by processing all filters set to the query chain.
   */
  select(): Collection<M> {
    let models = this.getModels()

    models = this.filterWhere(models)

    return models
  }

  /**
   * Filter the given collection by the registered where clause.
   */
  private filterWhere(models: Collection<M>): Collection<M> {
    if (isEmpty(this.wheres)) {
      return models
    }

    const comparator = this.getWhereComparator()

    return models.filter((model) => comparator(model))
  }

  /**
   * Get comparator for the where clause.
   */
  private getWhereComparator(): (model: M) => boolean {
    const { and, or } = groupBy(this.wheres, (where) => where.boolean)

    return (model) => {
      const results: boolean[] = []

      and && results.push(and.every((w) => this.whereComparator(model, w)))
      or && results.push(or.some((w) => this.whereComparator(model, w)))

      return results.indexOf(true) !== -1
    }
  }

  /**
   * The function to compare where clause to the given model.
   */
  private whereComparator(model: M, where: Options.Where): boolean {
    return model[where.field] === where.value
  }

  /**
   * Insert the given record to the store.
   */
  async insert(records: Record[]): Promise<Collection<M>> {
    const models = this.hydrateRecords(records)

    this.connection().insert(this.dehydrateModels(models))

    return models
  }

  /**
   * Update records in the store.
   */
  async update(record: Record): Promise<Collection<M>> {
    const models = this.mergeModelsWithRecord(this.get(), record)

    this.connection().update(this.dehydrateModels(models))

    return models
  }

  /**
   * Delete records that match the query chain.
   */
  async delete(): Promise<Collection<M>> {
    const models = this.get()

    this.connection().delete(this.getIdsFromCollection(models))

    return models
  }

  /**
   * Delete all records in the store.
   */
  async deleteAll(): Promise<Collection<M>> {
    const models = this.getModels()

    this.connection().deleteAll()

    return models
  }

  /**
   * Destroy the models for the given id.
   */
  async destroy(id: string | number): Promise<Item<M>> {
    const indexId = this.normalizeIndexId(id)

    const model = this.find(indexId)

    if (!model) {
      return null
    }

    this.connection().delete([indexId])

    return model
  }

  /**
   * Destroy the models for the given id.
   */
  async destroyMany(ids: (string | number)[]): Promise<Collection<M>> {
    const indexIds = this.normalizeIndexIds(ids)

    const models = this.findIn(indexIds)

    this.connection().delete(indexIds)

    return models
  }

  /**
   * Normalize the given index id. This method will convert the given key to
   * the string since the index key must be a string.
   */
  private normalizeIndexId(id: string | number): string {
    return String(id)
  }

  /**
   * Normalize the given index ids. This method will convert the given key to
   * the string since the index key must be a string.
   */
  private normalizeIndexIds(ids: (string | number)[]): string[] {
    return ids.map((id) => String(id))
  }

  /**
   * Instantiate new models with the given record.
   */
  private hydrateRecord(record: Record): M {
    return new this.model(record)
  }

  /**
   * Instantiate new models with the given collection of records.
   */
  private hydrateRecords(records: Record[]): Collection<M> {
    return records.map((record) => this.hydrateRecord(record))
  }

  /**
   * Convert all models into the plain record.
   */
  private dehydrateModels(models: Collection<M>): Record[] {
    return models.map((model) => model.$getAttributes())
  }

  /**
   * Merge models with the given record.
   */
  private mergeModelsWithRecord(
    models: Collection<M>,
    record: Record
  ): Collection<M> {
    return models.map((model) => model.$fill(record))
  }

  /**
   * Get an array of ids from the given collection.
   */
  private getIdsFromCollection(models: Collection<M>): string[] {
    return models.map((model) => model.$getIndexId())
  }
}
