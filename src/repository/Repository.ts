import { Store } from 'vuex'
import { Constructor } from '../types'
import * as Data from '../data/Data'
import Model from '../model/Model'
import Interpretation from '../interpretation/Interpretation'
import Query from '../query/Query'

type PersistMethod = 'insert' | 'merge'

interface CollectionPromises {
  indexes: string[]
  promises: Promise<Data.Collection<Model>>[]
}

export default class Repository<M extends Model> {
  /**
   * The store instance.
   */
  protected store: Store<any>

  /**
   * The model object.
   */
  protected model: M

  /**
   * Create a new repository instance.
   */
  constructor(store: Store<any>, model: M | Constructor<M>) {
    this.store = store
    this.model = model instanceof Model ? model : new model()
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
   * Set the relationships that should be eager loaded.
   */
  with(name: string): Query<M> {
    return this.query().with(name)
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
  find(id: string | number): Data.Item<M>
  find(ids: (string | number)[]): Data.Collection<M>
  find(ids: any): Data.Item<any> {
    return this.query().find(ids)
  }

  /**
   * Insert the given record to the store.
   */
  insert(record: Data.Record | Data.Record[]): Promise<Data.Collections> {
    return this.persist('insert', record)
  }

  /**
   * Update records in the store.
   */
  update(record: Data.Record | Data.Record[]): Promise<Data.Collections> {
    return this.persist('merge', record)
  }

  /**
   * Persist records to the store by the given method.
   */
  protected persist(
    method: PersistMethod,
    record: Data.Record | Data.Record[]
  ): Promise<Data.Collections> {
    const normalizedData = this.interpret(record)

    const { indexes, promises } = this.createCollectionPromises(
      method,
      normalizedData
    )

    return this.resolveCollectionPromises(indexes, promises)
  }

  /**
   * Persist normalized records with the given method.
   */
  protected persistRecords(
    method: PersistMethod,
    records: Data.Records
  ): Promise<Data.Collection<M>> {
    return this.query()[method](this.mapNormalizedData(records))
  }

  /**
   * Create collection promises for the given normalized data.
   */
  protected createCollectionPromises(
    method: PersistMethod,
    data: Data.NormalizedData
  ): CollectionPromises {
    const indexes: string[] = []
    const promises: Promise<Data.Collection<any>>[] = []

    for (const entity in data) {
      const records = data[entity]
      const repository = this.newRepository(entity)

      indexes.push(entity)
      promises.push(repository.persistRecords(method, records))
    }

    return { indexes, promises }
  }

  /**
   * Resolve all collection promises and create a new collections object.
   */
  protected async resolveCollectionPromises(
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
  protected mapNormalizedData(records: Data.Records): Data.Record[] {
    const items = [] as Data.Record[]

    for (const id in records) {
      items.push(records[id])
    }

    return items
  }

  /**
   * Normalize the given record.
   */
  protected interpret(
    records: Data.Record | Data.Record[]
  ): Data.NormalizedData {
    return this.interpretation().process(records)
  }

  /**
   * Destroy the models for the given id.
   */
  destroy(id: string | number): Promise<Data.Item<M>>
  destroy(ids: (string | number)[]): Promise<Data.Collection<M>>
  destroy(ids: any): Promise<any> {
    return this.query().destroy(ids)
  }

  /**
   * Delete all records in the store.
   */
  deleteAll(): Promise<Data.Collection<M>> {
    return this.query().deleteAll()
  }
}
