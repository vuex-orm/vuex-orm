import { Record, NormalizedData, PlainItem } from '../../data/Contract'
import Model from '../../model/Model'
import Repo, { Relation as Load } from '../../repo/Repo'
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
   * Create a new belongs to instance.
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
  attach (key: any, record: Record, _data: NormalizedData): void {
    if (record[this.foreignKey] !== undefined) {
      return
    }

    record[this.foreignKey] = key
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
  make (value: any, _parent: Record, _key: string): Model | null {
    return value ? new this.parent(value) : null
  }
}
