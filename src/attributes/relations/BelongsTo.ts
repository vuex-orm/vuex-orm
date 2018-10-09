import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, NormalizedData } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
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
    super(model) /* istanbul ignore next */

    this.parent = this.model.relation(parent)
    this.foreignKey = foreignKey
    this.ownerKey = ownerKey
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  define (schema: Schema): NormalizrSchema {
    return schema.one(this.parent)
  }

  /**
   * Attach the relational key to the given data. For example,
   * when Post belongs to User, it will attach value to the
   * `user_id` field of Post record.
   */
  attach (key: any, record: Record, _data: NormalizedData): void {
    // See if the record has the foreign key, if yes, it means the user has
    // provided the key explicitly so do nothing and return.
    if (record[this.foreignKey] !== undefined) {
      return
    }

    // If there is no foreign key, let's set it here.
    record[this.foreignKey] = key
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make (value: any, _parent: Record, _key: string): Model | null {
    if (!this.isOneRelation(value)) {
      return null
    }

    return new this.parent(value)
  }

  /**
   * Load the belongs to relationship for the collection.
   */
  load (query: Query, collection: Record[], key: string): void {
    const relatedQuery = this.getRelation(query, this.parent.entity)

    query.where(this.ownerKey, this.getKeys(collection, this.foreignKey))

    const relations = this.mapSingleRelations(relatedQuery.get(), this.ownerKey)

    collection.forEach((item) => {
      const related = relations[item[this.foreignKey]]

      item[key] = related || null
    })
  }
}
