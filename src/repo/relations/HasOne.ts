import { Record } from '../../Data'
import Model from '../../Model'
import { Item } from '../Query'
import { Fields } from '../Attribute'
import Repo, { Relation as Load } from '../Repo'
import Relation from './Relation'

export default class HasOne extends Relation {
  /**
   * The related model.
   */
  related: typeof Model

  /**
   * The foregin key of the related model.
   */
  foreignKey: string

  /**
   * The local key of the model.
   */
  localKey: string

  /**
   * The related record.
   */
  record: Item

  /**
   * Create a new has one instance.
   */
  constructor (related: typeof Model | string, foreignKey: string, localKey: string, record: Item, connection?: string) {
    super()

    this.related = this.model(related, connection)
    this.foreignKey = foreignKey
    this.localKey = localKey
    this.record = record
  }

  /**
   * Load the has one relationship for the record.
   */
  load (repo: Repo, record: Record, relation: Load): Item {
    const query = new Repo(repo.state, this.related.entity, false)

    query.where(this.foreignKey, record[this.localKey])

    this.addConstraint(query, relation)

    return query.first()
  }

  /**
   * Make model instances of the relation.
   */
  make (_parent: Fields): Model | null {
    return this.record ? new this.related(this.record) : null
  }
}
