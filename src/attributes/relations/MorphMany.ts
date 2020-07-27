import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, NormalizedData, Collection } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
import Constraint from '../../query/contracts/RelationshipConstraint'
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
   * The field name that contains type of the parent model.
   */
  type: string

  /**
   * The local key of the model.
   */
  localKey: string

  /**
   * Create a new belongs to instance.
   */
  constructor(
    model: typeof Model,
    related: Entity,
    id: string,
    type: string,
    localKey: string
  ) {
    super(model) /* istanbul ignore next */

    this.related = this.model.relation(related)
    this.id = id
    this.type = type
    this.localKey = localKey
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.many(this.related)
  }

  /**
   * Attach the relational key to the given data.
   */
  attach (key: any, record: Record, data: NormalizedData): void {
    key.forEach((related: any) => {
      let relatedItem

      if (typeof related === 'object') {
        relatedItem = data[(this.related.getTypeModel(related.schema) as typeof Model).entity][related.id]
      } else {
        relatedItem = data[this.related.entity][related]
      }

      relatedItem[this.id] = relatedItem[this.id] || this.related.getIdFromRecord(record)
      relatedItem[this.type] = relatedItem[this.type] || this.model.baseEntity || this.model.entity
    })
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make(value: any, _parent: Record, _key: string): Model[] {
    return this.makeManyRelation(value, this.related)
  }

  /**
   * Load the morph many relationship for the record.
   */
  load(
    query: Query,
    collection: Collection,
    name: string,
    constraints: Constraint[]
  ): void {
    const relatedQuery = this.getRelation(
      query,
      this.related.entity,
      constraints
    )

    this.addEagerConstraintForMorphMany(relatedQuery, collection, query.baseModel.entity)

    const relations = this.mapManyRelations(relatedQuery.get(), this.id)

    collection.forEach((item) => {
      const related = relations.get(item[this.localKey])

      item[name] = related || []
    })
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraintForMorphMany(
    query: Query,
    collection: Collection,
    type: string
  ): void {
    query
      .whereFk(this.type, type)
      .whereFk(this.id, this.getKeys(collection, this.localKey))
  }
}
