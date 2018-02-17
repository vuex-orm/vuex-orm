import { Record } from '../../Data'
import Model from '../../Model'
import { Collection } from '../Query'
import { Fields } from '../Attribute'
import Repo, { Relation as Load } from '../Repo'
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
  records: Collection

  /**
   * Create a new belongs to instance.
   */
  constructor (related: Entity, id: string, type: string, localKey: string, record: Collection, connection?: string) {
    super()

    this.related = this.model(related, connection)
    this.id = id
    this.type = type
    this.localKey = localKey
    this.records = record
  }

  /**
   * Load the morph many relationship for the record.
   */
  load (repo: Repo, record: Record, relation: Load): Collection {
    const query = new Repo(repo.state, this.related.entity, false)

    query.where(this.id, record[this.localKey]).where(this.type, repo.name)

    this.addConstraint(query, relation)

    return query.get()
  }

  /**
   * Make model instances of the relation.
   */
  make (_parent: Fields): Model[] {
    if (this.records.length === 0) {
      return []
    }

    return this.records.map(record => new this.related(record))
  }
}
