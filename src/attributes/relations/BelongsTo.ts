import { Record, PlainItem } from '../../data/Contract'
import Model from '../../model/Model'
import Repo, { Relation as Load } from '../../repo/Repo'
import { Fields } from '../contracts/Contract'
import Relation from './Relation'

export default class BelongsTo extends Relation {
  /**
   * The parent model.
   */
  parent: typeof Model

  /**
   * The foregin key of the model.
   */
  foreignKey: string

  /**
   * The associated key on the parent model.
   */
  ownerKey: string

  /**
   * The related record.
   */
  record: PlainItem = null

  /**
   * Create a new belongs to instance.
   */
  constructor (model: typeof Model, parent: typeof Model | string, foreignKey: string, ownerKey: string) {
    super(model)

    this.parent = this.model.relation(parent)
    this.foreignKey = foreignKey
    this.ownerKey = ownerKey
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
   * Load the belongs to relationship for the record.
   */
  load (repo: Repo, record: Record, relation: Load): PlainItem {
    const query = new Repo(repo.state, this.parent.entity, false)

    query.where(this.ownerKey, record[this.foreignKey])

    this.addConstraint(query, relation)

    return query.first()
  }

  /**
   * Make model instances of the relation.
   */
  make (_parent: Fields, _key: string): Model | null {
    return this.record ? new this.parent(this.record) : null
  }
}
