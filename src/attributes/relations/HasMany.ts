import { Record, NormalizedData, PlainCollection } from '../../data/Contract'
import Model from '../../model/Model'
import Repo, { Relation as Load } from '../../repo/Repo'
import Relation from './Relation'

export default class HasMany extends Relation {
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
   * The related records.
   */
  records: PlainCollection = []

  /**
   * Create a new has many instance.
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
    this.records = value
  }

  /**
   * Return empty array if the value is not present.
   */
  fill (value: any): any {
    return value || []
  }

  /**
   * Attach the relational key to the given record.
   */
  attach (key: any, record: Record, data: NormalizedData): void {
    key.forEach((index: any) => {
      const related = data[this.related.entity][index]

      if (!related || related[this.foreignKey] !== undefined) {
        return
      }

      related[this.foreignKey] = record.$id
    })
  }

  /**
   * Load the has many relationship for the record.
   */
  load (repo: Repo, record: Record, relation: Load): PlainCollection {
    const query = new Repo(repo.state, this.related.entity, false)

    query.where(this.foreignKey, record[this.localKey])

    this.addConstraint(query, relation)

    return query.get()
  }

  /**
   * Make model instances of the relation.
   */
  make (value: any, _parent: Record, _key: string): Model[] {
    if (value.length === 0) {
      return []
    }

    if (typeof value[0] !== 'object') {
      return []
    }

    return value.map((record: Record) => new this.related(record))
  }
}
