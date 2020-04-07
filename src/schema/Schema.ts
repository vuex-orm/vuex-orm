import { schema as Normalizr } from 'normalizr'
import { Record } from '../data/Data'
import Model from '../model/Model'
import Constructor from '../model/Constructor'

export default class Schema<M extends Model> {
  /**
   * The model instance.
   */
  model: Constructor<M>

  /**
   * Create a new schema instance.
   */
  constructor(model: Constructor<M>) {
    this.model = model
  }

  /**
   * Create a single schema.
   */
  one(): Normalizr.Entity {
    const schema = this.newEntity()

    return schema
  }

  /**
   * Create a new normalizr entity.
   */
  private newEntity(): Normalizr.Entity {
    const entity = this.model.entity
    const idAttribute = this.idArrtibute.bind(this)

    return new Normalizr.Entity(entity, {}, { idAttribute })
  }

  /**
   * The id attribute option for the normalizr entity.
   */
  private idArrtibute(
    record: Record,
    _parentRecord: Record,
    _key: string
  ): string {
    return this.model.getIndexId(record)
  }
}
