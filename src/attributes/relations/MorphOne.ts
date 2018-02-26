import { Record, NormalizedData, PlainItem } from '../../data/Contract'
import Model from '../../model/Model'
import Repo, { Relation as Load } from '../../repo/Repo'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class MorphOne extends Relation {
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
    return value === undefined || Array.isArray(value) ? null : value
  }

  /**
   * Transform the given data to an appropriate value to be used for
   * model instantiation.
   */
  fill (value: any): any {
    return value && typeof value === 'object' ? value : null
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
    const query = new Repo(repo.state, this.related.entity, false)

    query.where(this.id, record[this.localKey]).where(this.type, repo.name)

    this.addConstraint(query, relation)

    return query.first()
  }

  /**
   * Make model instances of the relation.
   */
  make (value: any, _parent: Record, _key: string): Model | null {
    return value ? new this.related(value) : null
  }
}
