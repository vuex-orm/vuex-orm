import { Record, NormalizedData, PlainItem } from '../../data/Contract'
import Model from '../../model/Model'
import Repo, { Relation as Load } from '../../repo/Repo'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class MorphTo extends Relation {
  /**
   * The field name that contains id of the parent model.
   */
  id: string

  /**
   * The field name fthat contains type of the parent model.
   */
  type: string

  /**
   * Create a new morph to instance.
   */
  constructor (model: typeof Model, id: string, type: string) {
    super(model)

    this.id = id
    this.type = type
  }

  /**
   * Transform given data to the appropriate value. This method will be called
   * during data normalization to fix field that has an incorrect value,
   * or add a missing field with the appropriate default value.
   */
  fill (value: any): string | number | null | Record {
    if (value === undefined) {
      return null
    }

    if (Array.isArray(value)) {
      return null
    }

    return value
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  make (value: any, parent: Record, _key: string): Model | null {
    if (value === undefined) {
      return null
    }

    if (Array.isArray(value)) {
      return null
    }

    const related: string = parent[this.type]
    const model = this.model.relation(related)

    return model ? new model(value) : null
  }

  /**
   * Attach the relational key to the given record.
   */
  attach (_key: any, _record: Record, _data: NormalizedData): void {
    return
  }

  /**
   * Load the morph many relationship for the record.
   */
  load (repo: Repo, record: Record, relation: Load): PlainItem {
    const related = this.model.relation(record[this.type])
    const ownerKey = related.localKey()
    const query = new Repo(repo.state, related.entity, false)

    query.where(ownerKey, record[this.id])

    this.addConstraint(query, relation)

    return query.first()
  }
}
