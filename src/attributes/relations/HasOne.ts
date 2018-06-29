import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
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
   * Define the normalizr schema for the relationship.
   */
  define (schema: Schema): NormalizrSchema {
    return schema.one(this.related)
  }

  /**
   * Attach the relational key to the related data. For example,
   * when User has one Phone, it will attach value to the
   * `user_id` field of Phone record.
   */
  attach (key: any, record: Record, data: NormalizedData): void {
    // Get related record.
    const related = data[this.related.entity]

    // If there's no related record, there's nothing we can do so return here.
    if (!related) {
      return
    }

    // If there is a related record, check if the related record already has
    // proper foreign key value. If it has, that means the user has provided
    // the foreign key themselves so leave it alone and do nothing.
    if (related[key] && related[key][this.foreignKey] !== undefined) {
      return
    }

    // Check if the record has local key set. If not, set the local key to be
    // the id value. This happens if the user defines the custom local key
    // and didn't include in the data being normalized.
    if (!record[this.localKey]) {
      record[this.localKey] = record.$id
    }

    // Finally, set the foreign key of the related record to be the local
    // key of this record.
    related[key][this.foreignKey] = record[this.localKey]
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
    if (!this.isOneRelation(value)) {
      return null
    }

    return this.related.make(value, plain)
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
