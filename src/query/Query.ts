import { Store } from 'vuex'
import { Record, Item, Collection } from '../data/Data'
import Model from '../model/Model'
import Constructor from '../model/Constructor'
import Connection from '../connection/Connection'

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
   * Get records by processing the whole query chain.
   */
  get(): Collection<M> {
    return this.getModels()
  }

  /**
   * Find the model with the given id.
   */
  find(id: string | number): Item<M> {
    const record = this.connection().find(id)

    return record ? this.hydrateRecord(record) : null
  }

  /**
   * Get all existing records and hydrate them all. The difference with `get`
   * method is that this method will not process any query chain.
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
   * Insert the given record to the store.
   */
  async insert(records: Record[]): Promise<Collection<M>> {
    const models = this.hydrateRecords(records)

    this.connection().insert(this.dehydrateModels(models))

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
}
