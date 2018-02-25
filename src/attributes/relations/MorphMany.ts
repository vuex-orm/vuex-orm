import { Record, NormalizedData, PlainCollection } from '../../data/Contract'
import Model from '../../model/Model'
import Repo, { Relation as Load } from '../../repo/Repo'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class MorphMany extends Relation {
  /**
   * The related model.
   */
  related: typeof Model

  /**
   * The field name that contains id of the parent model.
   */
  id: string

  /**
   * The field name fthat contains type of the parent model.
   */
  type: string

  /**
   * The local key of the model.
   */
  localKey: string

  /**
   * The related record.
   */
  records: PlainCollection = []

  /**
   * Create a new belongs to instance.
   */
  constructor (model: typeof Model, related: Entity, id: string, type: string, localKey: string) {
    super(model)

    this.related = this.model.relation(related)
    this.id = id
    this.type = type
    this.localKey = localKey
  }

  /**
   * Normalize the given value. This method is called during data normalization
   * to generate appropriate value to be saved to Vuex Store.
   */
  normalize (value: any): any {
    return Array.isArray(value) ? value : []
  }

  /**
   * Return empty array if the value is not present.
   */
  fill (value: any): any {
    if (!Array.isArray(value)) {
      return []
    }

    return value.filter((record) => {
      return record && typeof record === 'object'
    })
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
  load (repo: Repo, record: Record, relation: Load): PlainCollection {
    const query = new Repo(repo.state, this.related.entity, false)

    query.where(this.id, record[this.localKey]).where(this.type, repo.name)

    this.addConstraint(query, relation)

    return query.get()
  }

  /**
   * Make model instances of the relation.
   */
  make (value: any, _parent: Record, _key: string): Model[] {
    if (value.length === 0) {
      return []
    }

    return value.map((record: Record) => new this.related(record))
  }
}
