import { Record, NormalizedData } from '../../data'
import Model from '../../model/Model'
import Query, { Relation as Load } from '../../query/Query'
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
   * Create a new has one instance.
   */
  constructor (model: typeof Model, related: typeof Model | string, foreignKey: string, localKey: string) {
    super(model) /* istanbul ignore next */

    this.related = this.model.relation(related)
    this.foreignKey = foreignKey
    this.localKey = localKey
  }

  /**
   * Validate the given value to be a valid value for the relationship.
   */
  fill (value: any): string | number | null {
    return this.fillOne(value)
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  make (value: any, _parent: Record, _key: string, plain: boolean = false): Model | Record | null {
    if (value === null) {
      return null
    }

    if (value === undefined) {
      return null
    }

    if (Array.isArray(value)) {
      return null
    }

    return this.related.make(value, plain)
  }

  /**
   * Attach the relational key to the given record.
   */
  attach (key: any, record: Record, data: NormalizedData): void {
    const related = data[this.related.entity]

    if (related && related[key] && related[key][this.foreignKey] !== undefined) {
      return
    }

    if (!record[this.localKey]) {
      record[this.localKey] = record.$id
    }

    related[key][this.foreignKey] = record[this.localKey]
  }

  /**
   * Load the has one relationship for the record.
   */
  load (query: Query, collection: Record[], relation: Load): Record[] {
    const relatedPath = this.relatedPath(relation.name)

    const localKeys = collection.map(record => record[this.localKey])

    const relatedQuery = query.newPlainQuery(this.related.entity)

    relatedQuery.where(this.foreignKey, localKeys)

    this.addConstraint(relatedQuery, relation)

    const relatedRecords = this.mapRecords(relatedQuery.get(), this.foreignKey)

    return collection.map((item) => {
      const related = relatedRecords[item[this.localKey]]

      return this.setRelated(item, related || null, relatedPath)
    })
  }
}
