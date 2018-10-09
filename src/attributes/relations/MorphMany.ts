import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, NormalizedData } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class MorphMany extends Relation {
  /**
   * The related model.
   */
  related: typeof Model

  /**
   * The field name that contains id of the parent model.
   */
  id: string

  /**
   * The field name fthat contains type of the parent model.
   */
  type: string

  /**
   * The local key of the model.
   */
  localKey: string

  /**
   * Create a new belongs to instance.
   */
  constructor (model: typeof Model, related: Entity, id: string, type: string, localKey: string) {
    super(model) /* istanbul ignore next */

    this.related = this.model.relation(related)
    this.id = id
    this.type = type
    this.localKey = localKey
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  define (schema: Schema): NormalizrSchema {
    return schema.many(this.related)
  }

  /**
   * Attach the relational key to the given data.
   */
  attach (key: any, record: Record, data: NormalizedData): void {
    if (!Array.isArray(key)) {
      return
    }

    const relatedItems = data[this.related.entity]

    key.forEach((id: any) => {
      const relatedItem = relatedItems[id]

      relatedItem[this.id] = relatedItem[this.id] || record.$id
      relatedItem[this.type] = relatedItem[this.type] || this.model.entity
    })
  }

  /**
   * Convert given value to the appropriate value for the attribute.
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
      return new this.related(record)
    })
  }

  /**
   * Load the morph many relationship for the record.
   */
  load (query: Query, collection: Record[], key: string): void {
    const relatedQuery = this.getRelation(query, this.related.entity)

    this.addEagerConstraintForMorphMany(relatedQuery, collection, query.entity)

    const relations = this.mapManyRelations(relatedQuery.get(), this.id)

    collection.forEach((item) => {
      const related = relations[item[this.localKey]]

      item[key] = related
    })
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraintForMorphMany (query: Query, collection: Record[], type: string): void {
    query.where(this.type, type).where(this.id, this.getKeys(collection, this.localKey))
  }
}
