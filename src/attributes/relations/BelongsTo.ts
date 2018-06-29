import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, NormalizedData } from '../../data'
import Model from '../../model/Model'
import Query, { Relation as Load } from '../../query/Query'
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

    return this.parent.make(value, plain)
  }

  /**
   * Load the belongs to relationship for the record.
   */
  load (query: Query, collection: Record[], relation: Load): Record[] {
    const relatedPath = this.relatedPath(relation.name)

    const foreignKeys = collection.map(record => record[this.foreignKey])

    const relatedQuery = query.newPlainQuery(this.parent.entity).where(this.ownerKey, foreignKeys)

    this.addConstraint(relatedQuery, relation)

    const relatedRecords = this.mapRecords(relatedQuery.get(), this.ownerKey)

    return collection.map((item) => {
      const related = relatedRecords[item[this.foreignKey]]

      return this.setRelated(item, related || null, relatedPath)
    })
  }
}
