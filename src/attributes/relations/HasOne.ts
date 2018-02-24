import { Record, NormalizedData, PlainItem } from '../../data/Contract'
import Model from '../../model/Model'
import Repo, { Relation as Load } from '../../repo/Repo'
import { Fields } from '../contracts/Contract'
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
  record: PlainItem = null

  /**
   * Create a new has one instance.
   */
  constructor (model: typeof Model, related: typeof Model | string, foreignKey: string, localKey: string) {
    super(model)

    this.related = this.model.relation(related)
    this.foreignKey = foreignKey
    this.localKey = localKey
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
  attach (key: any, record: Record, data: NormalizedData): void {
    const related = data[this.related.entity][key]

    if (!related || related[this.foreignKey] !== undefined) {
      return
    }

    related[this.foreignKey] = record.$id
  }

  /**
   * Load the has one relationship for the record.
   */
  load (repo: Repo, record: Record, relation: Load): PlainItem {
    const query = new Repo(repo.state, this.related.entity, false)

    query.where(this.foreignKey, record[this.localKey])

    this.addConstraint(query, relation)

    return query.first()
  }

  /**
   * Make model instances of the relation.
   */
  make (_parent: Fields, _key: string): Model | null {
    return this.record ? new this.related(this.record) : null
  }
}
