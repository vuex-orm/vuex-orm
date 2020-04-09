import { Store } from 'vuex'
import { isArray, isEmpty, groupBy } from '../support/Utils'
import { Record, Item, Collection } from '../data/Data'
import { Relation } from '../model/attributes/Attributes'
import Model from '../model/Model'
import Connection from '../connection/Connection'
import * as Options from './options/Options'

export default class Query<M extends Model = Model> {
  /**
   * The store instance.
   */
  protected store: Store<any>

  /**
   * The model object.
   */
  protected model: M

  /**
   * The where constraints for the query.
   */
  protected wheres: Options.Where[] = []

  /**
   * The maximum number of records to return.
   */
  protected take: number | null = null

  /**
   * The number of records to skip.
   */
  protected skip: number = 0

  /**
   * The relationships that should be eager loaded.
   */
  protected eagerLoad: Options.EagerLoad = {}

  /**
   * Create a new query instance.
   */
  constructor(store: Store<any>, model: M) {
    this.store = store
    this.model = model
  }

  /**
   * Create a new query instance from the given relation.
   */
  protected newQueryForRelation(relation: Relation): Query<Model> {
    return new Query(this.store, relation.getRelated())
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
   * Add a "where in" clause to the query.
   */
  whereIn(field: string, values: any[]): this {
    this.wheres.push({ field, value: values, boolean: 'and' })

    return this
  }

  /**
   * Add a where clause on the primary key to the query.
   */
  whereId(ids: string | number | (string | number)[]): this {
    return this.where(this.model.$getPrimaryKey(), ids)
  }

  /**
   * Add an "or where" clause to the query.
   */
  orWhere(field: string, value: any): Query<M> {
    this.wheres.push({ field, value, boolean: 'or' })

    return this
  }

  /**
   * Set the "take" value of the query.
   */
  limit(value: number): this {
    this.take = value

    return this
  }

  /**
   * Set the "offset" value of the query.
   */
  offset(value: number): this {
    this.skip = value

    return this
  }

  /**
   * Set the relationships that should be eager loaded.
   */
  with(name: string): Query<M> {
    this.eagerLoad[name] = () => {}

    return this
  }

  /**
   * Retrieve models by processing whole query chain.
   */
  get(): Collection<M> {
    const models = this.select()

    if (!isEmpty(models)) {
      this.eagerLoadRelations(models)
    }

    return models
  }

  /**
   * Execute the query and get the first result.
   */
  first(): Item<M> {
    return this.limit(1).get()[0]
  }

  /**
   * Find a model by its primary key.
   */
  find(id: string | number): Item<M>
  find(ids: (string | number)[]): Collection<M>
  find(ids: any): any {
    if (isArray(ids)) {
      return this.findIn(ids)
    }

    const model = this.findRaw(ids)

    return model ? this.hydrateRecord(model) : null
  }

  /**
   * Find multiple models by their primary keys.
   */
  findIn(ids: (string | number)[]): Collection<M> {
    return this.hydrateRecords(this.findInRaw(ids))
  }

  /**
   * Find a record by its primary key.
   */
  findRaw(id: string | number): Record | null {
    const indexId = this.normalizeIndexId(id)

    return this.connection().find(indexId)
  }

  /**
   * Find multiple records by their primary keys.
   */
  findInRaw(ids: (string | number)[]): Record[] {
    const indexIds = this.normalizeIndexIds(ids)

    return this.connection().findIn(indexIds)
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
    models = this.filterLimit(models)

    return models
  }

  /**
   * Filter the given collection by the registered where clause.
   */
  protected filterWhere(models: Collection<M>): Collection<M> {
    if (isEmpty(this.wheres)) {
      return models
    }

    const comparator = this.getWhereComparator()

    return models.filter((model) => comparator(model))
  }

  /**
   * Get comparator for the where clause.
   */
  protected getWhereComparator(): (model: M) => boolean {
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
  protected whereComparator(model: M, where: Options.Where): boolean {
    if (isArray(where.value)) {
      return where.value.includes(model[where.field])
    }

    return model[where.field] === where.value
  }

  /**
   * Filter the given collection by the registered limit and offset values.
   */
  protected filterLimit(models: Collection<M>): Collection<M> {
    return this.take !== null
      ? models.slice(this.skip, this.skip + this.take)
      : models.slice(this.skip)
  }

  /**
   * Eager load the relationships for the models.
   */
  protected eagerLoadRelations(models: Collection<M>): void {
    for (const name in this.eagerLoad) {
      this.eagerLoadRelation(models, name, this.eagerLoad[name])
    }
  }

  /**
   * Eagerly load the relationship on a set of models.
   */
  protected eagerLoadRelation(
    models: Collection<M>,
    name: string,
    constraints: Options.EagerLoadConstraint
  ): void {
    // First we will "back up" the existing where conditions on the query so we can
    // add our eager constraints. Then we will merge the wheres that were on the
    // query back to it in order that any where conditions might be specified.
    const relation = this.getRelation(name)

    const query = this.newQueryForRelation(relation)

    relation.addEagerConstraints(query, models)

    constraints(query)

    // Once we have the results, we just match those back up to their parent models
    // using the relationship instance. Then we just return the finished arrays
    // of models which have been eagerly hydrated and are readied for return.
    relation.match(name, models, relation.getEager(query))
  }

  /**
   * Get the relation instance for the given relation name.
   */
  protected getRelation(name: string): Relation {
    return this.model.$getRelation(name)
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
   * Update records in the store by using the primary key of the given records.
   */
  async merge(records: Record[]): Promise<Collection<M>> {
    const models = this.getMergedModels(records)

    this.connection().update(this.dehydrateModels(models))

    return models
  }

  /**
   * Get models by merging the records. This method will use the primary key
   * in the records to fetch models and merge the given record to the model.
   */
  protected getMergedModels(records: Record[]): Collection<M> {
    return records.reduce<Collection<M>>((collection, record) => {
      const model = this.find(this.model.$getIndexId(record))

      model && collection.push(this.mergeModelWithRecord(model, record))

      return collection
    }, [])
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
   * Destroy the models for the given id.
   */
  async destroy(id: string | number): Promise<Item<M>>
  async destroy(ids: Array<string | number>): Promise<Collection<M>>
  async destroy(ids: any): Promise<any> {
    if (isArray(ids)) {
      return this.destroyMany(ids)
    }

    return (await this.whereId(ids).delete())[0] ?? null
  }

  /**
   * Destroy the models for the given id.
   */
  async destroyMany(ids: (string | number)[]): Promise<Collection<M>> {
    return this.whereId(ids).delete()
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
   * Normalize the given index id. This method will convert the given key to
   * the string since the index key must be a string.
   */
  protected normalizeIndexId(id: string | number): string {
    return String(id)
  }

  /**
   * Normalize the given index ids. This method will convert the given key to
   * the string since the index key must be a string.
   */
  protected normalizeIndexIds(ids: (string | number)[]): string[] {
    return ids.map((id) => String(id))
  }

  /**
   * Get an array of ids from the given collection.
   */
  protected getIdsFromCollection(models: Collection<M>): string[] {
    return models.map((model) => model.$getIndexId())
  }

  /**
   * Instantiate new models with the given record.
   */
  protected hydrateRecord(record: Record): M {
    return this.model.$newInstance(record)
  }

  /**
   * Instantiate new models with the given collection of records.
   */
  protected hydrateRecords(records: Record[]): Collection<M> {
    return records.map((record) => this.hydrateRecord(record))
  }

  /**
   * Convert all models into the plain record.
   */
  protected dehydrateModels(models: Collection<M>): Record[] {
    return models.map((model) => model.$getAttributes())
  }

  /**
   * Merge the model with the given record.
   */
  protected mergeModelWithRecord(model: M, record: Record): M {
    return model.$fill(record)
  }

  /**
   * Merge models with the given record.
   */
  protected mergeModelsWithRecord(
    models: Collection<M>,
    record: Record
  ): Collection<M> {
    return models.map((model) => model.$fill(record))
  }
}
