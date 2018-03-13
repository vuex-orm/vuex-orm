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
   * Create a new has many by instance.
   */
  constructor (model: typeof Model, parent: typeof Model | string, foreignKey: string, ownerKey: string) {
    super(model)

    this.parent = this.model.relation(parent)
    this.foreignKey = foreignKey
    this.ownerKey = ownerKey
  }

  /**
   * Transform given data to the appropriate value. This method will be called
   * during data normalization to fix field that has an incorrect value,
   * or add a missing field with the appropriate default value.
   */
  fill (value: any): (string | number | Record)[] {
    return Array.isArray(value) ? value : []
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  make (value: any, _parent: Record, _key: string): Model[] {
    if (value === null) {
      return []
    }

    if (value === undefined) {
      return []
    }

    if (!Array.isArray(value)) {
      return []
    }

    if (value.length === 0) {
      return []
    }

    return value.filter((record) => {
      return record && typeof record === 'object'
    }).map((record) => {
      return new this.parent(record)
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
}
