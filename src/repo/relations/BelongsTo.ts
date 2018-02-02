import { Record } from '../../Data'
import Model from '../../Model'
import { Item } from '../Query'
import Repo, { Relation as Load } from '../Repo'
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
  record: Item

  /**
   * Create a new belongs to instance.
   */
  constructor (parent: typeof Model | string, foreignKey: string, ownerKey: string, record: Item, connection?: string) {
    super()

    this.parent = this.model(parent, connection)
    this.foreignKey = foreignKey
    this.ownerKey = ownerKey
    this.record = record
  }

  /**
   * Load the belongs to relationship for the record.
   */
  load (repo: Repo, record: Record, relation: Load): Item {
    const query = new Repo(repo.state, this.parent.entity, false)

    query.where(this.ownerKey, record[this.foreignKey])

    this.addConstraint(query, relation)

    return query.first()
  }

  /**
   * Make model instances of the relation.
   */
  make (): Model | null {
    return this.record ? new this.parent(this.record) : null
  }
}
