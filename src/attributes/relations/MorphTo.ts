import { Record, NormalizedData, PlainItem } from '../../data/Contract'
import Model from '../../model/Model'
import Repo, { Relation as Load } from '../../repo/Repo'
import Attr from '../types/Attr'
import { Fields } from '../contracts/Contract'
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
   * The related record.
   */
  record: PlainItem = null

  /**
   * Create a new morph to instance.
   */
  constructor (model: typeof Model, id: string, type: string) {
    super(model)

    this.id = id
    this.type = type
  }

  /**
   * Set given value to the value field. This method is used when
   * instantiating model to fill the attribute value.
   */
  set (value: any): void {
    this.record = value
  }

  /**
   * Return null if the value is not present.
   */
  fill (value: any): any {
    return value || null
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

  /**
   * Make model instances of the relation.
   */
  make (parent: Fields, _key: string): Model | null {
    const related: string = (parent[this.type] as Attr).value
    const model = this.model.relation(related)

    return this.record ? new model(this.record) : null
  }
}
