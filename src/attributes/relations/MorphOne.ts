import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, NormalizedData, Collection } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
import Constraint from '../../query/contracts/RelationshipConstraint'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class MorphOne extends Relation {
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
    return schema.one(this.related)
  }

  /**
   * Attach the relational key to the given data.
   */
  attach(key: any, record: Record, data: NormalizedData): void {
    const relatedRecord = data[this.related.entity][key]

    relatedRecord[this.id] = relatedRecord[this.id] || this.related.getIdFromRecord(record)
    relatedRecord[this.type] = relatedRecord[this.type] || this.model.baseEntity || this.model.entity
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make(value: any, _parent: Record, _key: string): Model | null {
    return this.makeOneRelation(value, this.related)
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

    this.addEagerConstraintForMorphOne(relatedQuery, collection, query.baseModel.entity)

    const relations = this.mapSingleRelations(relatedQuery.get(), this.id)

    collection.forEach((item) => {
      const related = relations.get(item[this.localKey])

      item[name] = related || null
    })
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraintForMorphOne(
    query: Query,
    collection: Collection,
    type: string
  ): void {
    query
      .whereFk(this.type, type)
      .whereFk(this.id, this.getKeys(collection, this.localKey))
  }
}
