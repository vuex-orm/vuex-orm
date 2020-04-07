import { Store } from 'vuex'
import * as Data from '../data/Data'
import Model from '../model/Model'
import Constructor from '../model/Constructor'
import Interpretation from '../interpretation/Interpretation'
import Query from '../query/Query'

interface CollectionPromises {
  indexes: string[]
  promises: Promise<Data.Collection<Model>>[]
}

export default class Repository<M extends Model> {
  /**
   * The store instance.
   */
  store: Store<any>

  /**
   * The model object.
   */
  model: Constructor<M>

  /**
   * Create a new repository instance.
   */
  constructor(store: Store<any>, model: Constructor<M>) {
    this.store = store
    this.model = model
  }

  /**
   * Create a new repository instance for the given entity.
   */
  newRepository<T extends Model>(entity: string): Repository<T> {
    const model = this.store.$database.getModel(entity)

    return new Repository(this.store, model) as any
  }

  /**
   * Create a new interpretation instance.
   */
  interpretation(): Interpretation<M> {
    return new Interpretation(this.store, this.model)
  }

  /**
   * Create a new query instance.
   */
  query(): Query<M> {
    return new Query(this.store, this.model)
  }

  /**
   * Add a basic where clause to the query.
   */
  where(field: string, value: any): Query<M> {
    return this.query().where(field, value)
  }

  /**
   * Add an "or where" clause to the query.
   */
  orWhere(field: string, value: any): Query<M> {
    return this.query().orWhere(field, value)
  }

  /**
   * Get all models from the store.
   */
  all(): Data.Collection<M> {
    return this.query().get()
  }

  /**
   * Find the model with the given id.
   */
  find(id: string | number): Data.Item<M> {
    return this.query().find(id)
  }

  /**
   * Insert the given record to the store.
   */
  async insert(record: Data.Record | Data.Record[]): Promise<Data.Collections> {
    const normalizedData = this.interpret(record)

    const { indexes, promises } = this.createCollectionPromises(normalizedData)

    return this.resolveCollectionPromises(indexes, promises)
  }

  /**
   * Insert the given normalized data.
   */
  private insertNormalizedData(
    records: Data.Records
  ): Promise<Data.Collection<M>> {
    return this.query().insert(this.mapNormalizedData(records))
  }

  /**
   * Create collection promises for the given normalized data.
   */
  private createCollectionPromises(
    data: Data.NormalizedData
  ): CollectionPromises {
    const indexes: string[] = []
    const promises: Promise<Data.Collection<any>>[] = []

    for (const entity in data) {
      const records = data[entity]
      const repository = this.newRepository(entity)

      indexes.push(entity)
      promises.push(repository.insertNormalizedData(records))
    }

    return { indexes, promises }
  }

  /**
   * Resolve all collection promises and create a new collections object.
   */
  private async resolveCollectionPromises(
    indexes: string[],
    promises: Promise<Data.Collection<any>>[]
  ): Promise<Data.Collections> {
    return (await Promise.all(promises)).reduce<Data.Collections>(
      (collections, collection, index) => {
        collections[indexes[index]] = collection
        return collections
      },
      {}
    )
  }

  /**
   * Convert normalized data into an array of records.
   */
  private mapNormalizedData(records: Data.Records): Data.Record[] {
    const items = [] as Data.Record[]

    for (const id in records) {
      items.push(records[id])
    }

    return items
  }

  /**
   * Normalize the given record.
   */
  private interpret(records: Data.Record | Data.Record[]): Data.NormalizedData {
    return this.interpretation().process(records)
  }

  /**
   * Delete all records in the store.
   */
  deleteAll(): Promise<Data.Collection<M>> {
    return this.query().deleteAll()
  }

  /**
   * Destroy the models for the given id.
   */
  destroy(id: string | number): Promise<Data.Item<M>> {
    return this.query().destroy(id)
  }

  /**
   * Destroy the models for the given ids.
   */
  destroyMany(ids: (string | number)[]): Promise<Data.Collection<M>> {
    return this.query().destroyMany(ids)
  }
}
