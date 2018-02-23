import { Record, PlainCollection } from '../../data/Contract'
import Model from '../../model/Model'
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
  records: PlainCollection = []

  /**
   * Create a new has many by instance.
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
    this.records = value
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
  load (repo: Repo, record: Record, relation: Load): PlainCollection {
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
  make (_parent: Fields, _key: string): Model[] {
    if (this.records.length === 0) {
      return []
    }

    if (typeof (this.records[0] as any) !== 'object') {
      return []
    }

    return this.records.map(record => new this.parent(record))
  }
}
