import { Store } from 'vuex'
import { Record, Collection } from '../data/Data'
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
   * Insert the given record to the store.
   */
  async insert(records: Record[]): Promise<Collection<M>> {
    const models = this.hydrateRecords(records)

    this.connection().insert(this.dehydrateModels(models))

    return models
  }

  /**
   * Instantiate new models with the given collection of records.
   */
  private hydrateRecords(records: Record[]): Collection<M> {
    return records.map((record) => new this.model(record)) as any
  }

  /**
   * Convert all models into the plain record.
   */
  private dehydrateModels(models: Collection<M>): Record[] {
    return models.map((model) => model.$getAttributes())
  }
}
