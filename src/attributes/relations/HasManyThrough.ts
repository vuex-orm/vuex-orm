import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, Records, NormalizedData, Collection } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
import Constraint from '../../query/contracts/RelationshipConstraint'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class HasManyThrough extends Relation {
  /**
   * The related model.
   */
  related: typeof Model

  /**
   * The "through" parent model.
   */
  through: typeof Model

  /**
   * The near key on the relationship.
   */
  firstKey: string

  /**
   * The far key on the relationship.
   */
  secondKey: string

  /**
   * The local key on the relationship.
   */
  localKey: string

  /**
   * The local key on the intermediary model.
   */
  secondLocalKey: string

  /**
   * Create a new has many through instance.
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
   * Define the normalizr schema for the relationship.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.many(this.related)
  }

  /**
   * Attach the relational key to the given data. Since has many through
   * relationship doesn't have any foreign key, it would do nothing.
   */
  attach(_key: any, _record: Record, _data: NormalizedData): void {
    return
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make(value: any, _parent: Record, _key: string): Model[] {
    return this.makeManyRelation(value, this.related)
  }

  /**
   * Load the has many through relationship for the collection.
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

    const throughs = throughQuery.get()

    this.addEagerConstraintForRelated(relatedQuery, throughs)

    const relateds = this.mapThroughRelations(throughs, relatedQuery)

    collection.forEach((item) => {
      const related = relateds[item[this.localKey]]

      item[name] = related || []
    })
  }

  /**
   * Set the constraints for the through relation.
   */
  addEagerConstraintForThrough(query: Query, collection: Collection): void {
    query.where(this.firstKey, this.getKeys(collection, this.localKey))
  }

  /**
   * Set the constraints for the related relation.
   */
  addEagerConstraintForRelated(query: Query, collection: Collection): void {
    query.where(this.secondKey, this.getKeys(collection, this.secondLocalKey))
  }

  /**
   * Create a new indexed map for the through relation.
   */
  mapThroughRelations(throughs: Collection, relatedQuery: Query): Records {
    const relations = this.mapManyRelations(relatedQuery.get(), this.secondKey)

    return throughs.reduce<Record>((records, record) => {
      const id = record[this.firstKey]

      if (!records[id]) {
        records[id] = []
      }

      const related = relations.get(record[this.secondLocalKey])

      if (related === undefined) {
        return records
      }

      records[id] = records[id].concat(related)

      return records
    }, {})
  }
}
