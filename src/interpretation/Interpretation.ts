import { normalize, schema as Normalizr } from 'normalizr'
import { Store } from 'vuex'
import { isArray, isEmpty } from '../support/Utils'
import { Record, NormalizedData } from '../data/Data'
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

    const schema = this.getSchema()

    return normalize(data, isArray(data) ? [schema] : schema)
      .entities as NormalizedData
  }

  /**
   * Get the schema from the database.
   */
  private getSchema(): Normalizr.Entity {
    return this.store.$database.getSchema(this.model.$entity)
  }
}
