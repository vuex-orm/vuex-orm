import { Schema as NormalizrSchema } from 'normalizr'
import Utils from '../../support/Utils'
import Schema from '../../schema/Schema'
import { Record, Records, NormalizedData, Collection } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
import Constraint from '../../query/contracts/RelationshipConstraint'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class MorphToMany extends Relation {
  /**
   * The related model.
   */
  related: typeof Model

  /**
   * The pivot model.
   */
  pivot: typeof Model

  /**
   * The field name that conatins id of the related model.
   */
  relatedId: string

  /**
   * The field name that contains id of the parent model.
   */
  id: string

  /**
   * The field name fthat contains type of the parent model.
   */
  type: string

  /**
   * The key name of the parent model.
   */
  parentKey: string

  /**
   * The key name of the related model.
   */
  relatedKey: string

  /**
   * Create a new belongs to instance.
   */
  constructor (
    model: typeof Model,
    related: Entity,
    pivot: Entity,
    relatedId: string,
    id: string,
    type: string,
    parentKey: string,
    relatedKey: string
  ) {
    super(model) /* istanbul ignore next */

    this.related = this.model.relation(related)
    this.pivot = this.model.relation(pivot)
    this.relatedId = relatedId
    this.id = id
    this.type = type
    this.parentKey = parentKey
    this.relatedKey = relatedKey
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  define (schema: Schema): NormalizrSchema {
    return schema.many(this.related)
  }

  /**
   * Attach the relational key to the given record. Since morph to many
   * relationship doesn't have any foreign key, it would do nothing.
   */
  attach (_key: any, _record: Record, _data: NormalizedData): void {
    return
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make (value: any, _parent: Record, _key: string): Model[] {
    return this.makeManyRelation(value, this.related)
  }

  /**
   * Load the morph to many relationship for the collection.
   */
  load (query: Query, collection: Collection, name: string, constraints: Constraint[]): void {
    const relatedQuery = this.getRelation(query, this.related.entity, constraints)

    const pivotQuery = query.newQuery(this.pivot.entity)

    this.addEagerConstraintForPivot(pivotQuery, collection, query.entity)

    const pivots = pivotQuery.get()

    this.addEagerConstraintForRelated(relatedQuery, pivots)

    const relateds = this.mapPivotRelations(pivots, relatedQuery)

    collection.forEach((item) => {
      const related = relateds[item[this.parentKey]]

      item[name] = related || []
    })
  }

  /**
   * Set the constraints for the pivot relation.
   */
  addEagerConstraintForPivot (query: Query, collection: Collection, type: string): void {
    query.whereFk(this.type, type).whereFk(this.id, this.getKeys(collection, this.parentKey))
  }

  /**
   * Set the constraints for the related relation.
   */
  addEagerConstraintForRelated (query: Query, collection: Collection): void {
    query.whereFk(this.relatedKey, this.getKeys(collection, this.relatedId))
  }

  /**
   * Create a new indexed map for the pivot relation.
   */
  mapPivotRelations (pivots: Collection, relatedQuery: Query): Records {
    const relateds = this.mapManyRelations(relatedQuery.get(), this.relatedKey)

    return pivots.reduce((records, record) => {
      const id = record[this.id]

      if (!records[id]) {
        records[id] = []
      }

      const related = relateds[record[this.relatedId]]

      records[id] = records[id].concat(related)

      return records
    }, {} as Records)
  }

  /**
   * Create pivot records for the given records if needed.
   */
  createPivots (parent: typeof Model, data: NormalizedData, key: string): NormalizedData {
    Utils.forOwn(data[parent.entity], (record) => {
      const relatedIds = parent.query().newQuery(this.pivot.entity)
                                       .where(this.id, record[this.parentKey])
                                       .where(this.type, parent.entity)
                                       .get()

      const relateds = (record[key] || []).filter((relatedId: any) => !relatedIds.includes(relatedId))

      if (!Array.isArray(relateds) || relateds.length === 0) {
        return
      }

      this.createPivotRecord(parent, data, record, relateds)
    })

    return data
  }

  /**
   * Create a pivot record.
   */
  createPivotRecord (parent: typeof Model, data: NormalizedData, record: Record, related: any[]): void {
    related.forEach((id) => {
      const parentId = record[this.parentKey]
      const relatedId = data[this.related.entity][id][this.relatedKey]
      const pivotKey = `${parentId}_${id}_${parent.entity}`

      data[this.pivot.entity] = {
        ...data[this.pivot.entity],

        [pivotKey]: {
          $id: pivotKey,
          [this.relatedId]: relatedId,
          [this.id]: parentId,
          [this.type]: parent.entity
        }
      }
    })
  }
}
