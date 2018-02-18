import { Record } from '../../data/Contract'
import Model from '../../model/Model'
import { Collection } from '../../repo/Query'
import Repo, { Relation as Load } from '../../repo/Repo'
import { Fields } from '../contracts/Contract'
import Relation from './Relation'

export default class HasManyBy extends Relation {
  /**
   * The related model.
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
  records: Collection = []

  /**
   * Create a new has many by instance.
   */
  constructor (parent: typeof Model | string, foreignKey: string, ownerKey: string, connection?: string) {
    super(connection)

    this.parent = this.model(parent)
    this.foreignKey = foreignKey
    this.ownerKey = ownerKey
  }

  /**
   * Return empty array if the value is not present.
   */
  fill (value: any): any {
    return value || []
  }

  /**
   * Load the has many by relationship for the record.
   */
  load (repo: Repo, record: Record, relation: Load): Record[] | null {
    return record[this.foreignKey].map((id: any) => {
      const query = new Repo(repo.state, this.parent.entity, false)

      query.where(this.ownerKey, id)

      this.addConstraint(query, relation)

      return query.first()
    })
  }

  /**
   * Make model instances of the relation.
   */
  make (_parent: Fields): Model[] {
    if (this.records.length === 0) {
      return []
    }

    if (typeof (this.records[0] as any) !== 'object') {
      return []
    }

    return this.records.map(record => new this.parent(record))
  }
}
