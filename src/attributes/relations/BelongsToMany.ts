import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import Utils from '../../support/Utils'
import { Record, Records, NormalizedData, Collection } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
import Constraint from '../../query/contracts/RelationshipConstraint'
import Relation from './Relation'

export type Entity = typeof Model | string

export interface PivotRecord {
  [entity: string]: {
    [id: string]: {
      $id: string
      [pivotKey: string]: any
    }
  }
}

export default class BelongsToMany extends Relation {
  /**
   * The related model.
   */
  related: typeof Model

  /**
   * The pivot model.
   */
  pivot: typeof Model

  /**
   * The foreign key of the parent model.
   */
  foreignPivotKey: string

  /**
   * The associated key of the relation.
   */
  relatedPivotKey: string

  /**
   * The key name of the parent model.
   */
  parentKey: string

  /**
   * The key name of the related model.
   */
  relatedKey: string

  /**
   * The key name of the pivot data.
   */
  pivotKey: string

  /**
   * Create a new belongs to instance.
   */
  constructor (
    model: typeof Model,
    related: Entity,
    pivot: Entity,
    foreignPivotKey: string,
    relatedPivotKey: string,
    parentKey: string,
    relatedKey: string,
    pivotKey: string
  ) {
    super(model) /* istanbul ignore next */

    this.related = this.model.relation(related)
    this.pivot = this.model.relation(pivot)
    this.foreignPivotKey = foreignPivotKey
    this.relatedPivotKey = relatedPivotKey
    this.parentKey = parentKey
    this.relatedKey = relatedKey
    this.pivotKey = pivotKey
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  define (schema: Schema): NormalizrSchema {
    return schema.many(this.related)
  }

  /**
   * Attach the relational key to the given data. Since belongs to many
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
   * Load the belongs to relationship for the record.
   */
  load (query: Query, collection: Collection, name: string, constraints: Constraint[]): void {
    const relatedQuery = this.getRelation(query, this.related.entity, constraints)

    const pivotQuery = query.newQuery(this.pivot.entity)

    this.addEagerConstraintForPivot(pivotQuery, collection)

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
  addEagerConstraintForPivot (query: Query, collection: Collection): void {
    query.whereFk(this.foreignPivotKey, this.getKeys(collection, this.parentKey))
  }

  /**
   * Set the constraints for the related relation.
   */
  addEagerConstraintForRelated (query: Query, collection: Collection): void {
    query.whereFk(this.relatedKey, this.getKeys(collection, this.relatedPivotKey))
  }

  /**
   * Create a new indexed map for the pivot relation.
   */
  mapPivotRelations (pivots: Collection, relatedQuery: Query): Records {
    const relateds = this.mapManyRelations(relatedQuery.get(), this.relatedKey)

    return pivots.reduce((records, record) => {
      const id = record[this.foreignPivotKey]

      if (!records[id]) {
        records[id] = []
      }

      const related = relateds[record[this.relatedPivotKey]]

      if (related) {
        records[id] = records[id].concat(related.map((model: Record) => {
          model[this.pivotKey] = record
          return model
        }))
      }

      return records
    }, {} as Records)
  }

  /**
   * Create pivot records for the given records if needed.
   */
  createPivots (parent: typeof Model, data: NormalizedData, key: string): NormalizedData {
    if (this.pivot.primaryKey instanceof Array === false) return data

    Utils.forOwn(data[parent.entity], (record) => {
      const related = record[key]

      if (related === undefined || related.length === 0) {
        return
      }

      this.createPivotRecord(data, record, related)
    })

    return data
  }

  /**
   * Create a pivot record.
   */
  createPivotRecord (data: NormalizedData, record: Record, related: any[]): void {
    related.forEach((id) => {
      const parentId = record[this.parentKey]
      const relatedId = data[this.related.entity][id][this.relatedKey]
      const pivotKey = JSON.stringify([
        this.pivot.primaryKey[0] === this.foreignPivotKey ? parentId : relatedId,
        this.pivot.primaryKey[1] === this.foreignPivotKey ? parentId : relatedId
      ])
      const pivotRecord = data[this.pivot.entity] ? data[this.pivot.entity][pivotKey] : {}
      const pivotData = data[this.related.entity][id][this.pivotKey] || {}

      data[this.pivot.entity] = {
        ...data[this.pivot.entity],

        [pivotKey]: {
          ...pivotRecord,
          ...pivotData,
          $id: pivotKey,
          [this.foreignPivotKey]: parentId,
          [this.relatedPivotKey]: relatedId
        }
      }
    })
  }
}
