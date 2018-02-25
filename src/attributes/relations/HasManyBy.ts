import { Record, NormalizedData, PlainCollection } from '../../data/Contract'
import Model from '../../model/Model'
import Repo, { Relation as Load } from '../../repo/Repo'
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
  attach (key: any, record: Record, _data: NormalizedData): void {
    if (key.length === 0) {
      return
    }
    if (record[this.foreignKey] !== undefined) {
      return
    }

    record[this.foreignKey] = key
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
  make (value: any, _parent: Record, _key: string): Model[] {
    if (value.length === 0) {
      return []
    }

    return value.map((record: Record) => new this.parent(record))
  }
}
