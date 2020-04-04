import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, Records, NormalizedData, Collection } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
import Constraint from '../../query/contracts/RelationshipConstraint'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class HasOneThrough extends Relation {
  /**
   * The related model.
   */
  related: typeof Model

  /**
   * The "through" parent model.
   */
  through: typeof Model

  /**
   * The near key on the relation.
   */
  firstKey: string

  /**
   * The far key on the relation.
   */
  secondKey: string

  /**
   * The local key on the relation.
   */
  localKey: string

  /**
   * The local key on the intermediary model.
   */
  secondLocalKey: string

  /**
   * Create a new relation instance.
   */
  constructor(
    model: typeof Model,
    related: Entity,
    through: Entity,
    firstKey: string,
    secondKey: string,
    localKey: string,
    secondLocalKey: string
  ) {
    super(model) /* istanbul ignore next */

    this.related = this.model.relation(related)
    this.through = this.model.relation(through)
    this.firstKey = firstKey
    this.secondKey = secondKey
    this.localKey = localKey
    this.secondLocalKey = secondLocalKey
  }

  /**
   * Define the normalizr schema for the relation.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.one(this.related)
  }

  /**
   * Since the relation doesn't have a foreign key, there is no relational key
   * to attach to the given data.
   */
  attach(_key: any, _record: Record, _data: NormalizedData): void {
    return
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make(value: any, _parent: Record, _key: string): Model | null {
    return this.makeOneRelation(value, this.related)
  }

  /**
   * Load the relation for the given collection.
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

    const throughQuery = query.newQuery(this.through.entity)

    this.addEagerConstraintForThrough(throughQuery, collection)

    const through = throughQuery.get()

    this.addEagerConstraintForRelated(relatedQuery, through)

    const related = this.mapThroughRelations(through, relatedQuery)

    collection.forEach((item) => {
      const relation = related[item[this.localKey]]

      item[name] = relation || null
    })
  }

  /**
   * Set the constraints for the "through" relation.
   */
  addEagerConstraintForThrough(query: Query, collection: Collection): void {
    query.where(this.firstKey, this.getKeys(collection, this.localKey))
  }

  /**
   * Set the constraints for the "related" relation.
   */
  addEagerConstraintForRelated(query: Query, collection: Collection): void {
    query.where(this.secondKey, this.getKeys(collection, this.secondLocalKey))
  }

  /**
   * Create a new indexed map for the "through" relation.
   */
  mapThroughRelations(through: Collection, relatedQuery: Query): Records {
    const relations = this.mapSingleRelations(
      relatedQuery.get(),
      this.secondKey
    )

    return through.reduce<Record>((records, record) => {
      const id = record[this.firstKey]

      const related = relations.get(record[this.secondLocalKey])

      records[id] = related || null

      return records
    }, {})
  }
}
