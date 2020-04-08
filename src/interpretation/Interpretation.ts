import { normalize, schema as Normalizr } from 'normalizr'
import { Store } from 'vuex'
import { isArray, isEmpty } from '../support/Utils'
import { Record, Records, NormalizedData } from '../data/Data'
import Relation from '../model/attributes/relations/Relation'
import Model from '../model/Model'

export default class Interpretation<M extends Model> {
  /**
   * The store instance.
   */
  store: Store<any>

  /**
   * The model object.
   */
  model: M

  /**
   * Create a new interpreter instance.
   */
  constructor(store: Store<any>, model: M) {
    this.store = store
    this.model = model
  }

  /**
   * Perform interpretation for the given data.
   */
  process(data: Record | Record[]): NormalizedData {
    if (isEmpty(data)) {
      return {}
    }

    const normalizedData = this.normalize(data)

    this.attach(normalizedData)

    return normalizedData
  }

  private normalize(data: Record | Record[]): NormalizedData {
    const schema = isArray(data) ? [this.getSchema()] : this.getSchema()

    return normalize(data, schema).entities as NormalizedData
  }

  /**
   * Get the schema from the database.
   */
  private getSchema(): Normalizr.Entity {
    return this.store.$database.getSchema(this.model.$entity)
  }

  /**
   * Attach any missing foreign keys to the data.
   */
  private attach(data: NormalizedData): void {
    for (const entity in data) {
      this.attachRecords(entity, data[entity], data)
    }
  }

  /**
   * Attach any missing foreign key to the records.
   */
  private attachRecords(
    entity: string,
    records: Records,
    data: NormalizedData
  ): void {
    const model = this.store.$database.getModel(entity)

    if (!model.$hasRelation()) {
      return
    }

    for (const id in records) {
      this.attachRecord(model, records[id], data)
    }
  }

  /**
   * Attach any missing foreign key to the record.
   */
  private attachRecord(
    model: Model,
    record: Record,
    data: NormalizedData
  ): void {
    for (const key in record) {
      const attr = model.$fields[key]

      if (attr instanceof Relation) {
        attr.attach(record[key], record, data)
      }
    }
  }
}
