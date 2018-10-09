import { Schema as NormalizrSchema } from 'normalizr'
import Utils from '../../support/Utils'
import Schema from '../../schema/Schema'
import { Record, Records, NormalizedData } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class MorphedByMany extends Relation {
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
   * Attach the relational key to the given data. Since morphed by many
   * relationship doesn't have any foreign key, it would do nothing.
   */
  attach (_key: any, _record: Record, _data: NormalizedData): void {
    return
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
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

    const pivotQuery = query.newPlainQuery(this.pivot.entity)

    this.addEagerConstraintForPivot(pivotQuery, collection, this.related.entity)

    const pivots = pivotQuery.get()

    this.addEagerConstraintForRelated(relatedQuery, pivots)

    const relateds = this.mapPivotRelations(pivots, relatedQuery)

    collection.forEach((item) => {
      const related = relateds[item[this.parentKey]]

      item[key] = related
    })
  }

  /**
   * Set the constraints for the pivot relation.
   */
  addEagerConstraintForPivot (query: Query, collection: Record[], type: string): void {
    query.where(this.type, type).where(this.relatedId, this.getKeys(collection, this.parentKey))
  }

  /**
   * Set the constraints for the related relation.
   */
  addEagerConstraintForRelated (query: Query, collection: Record[]): void {
    query.where(this.relatedKey, this.getKeys(collection, this.id))
  }

  /**
   * Create a new indexed map for the pivot relation.
   */
  mapPivotRelations (pivots: Record[], relatedQuery: Query): Records {
    const relateds = this.mapManyRelations(relatedQuery.get(), this.relatedKey)

    return pivots.reduce((records, record) => {
      const id = record[this.relatedId]

      if (!records[id]) {
        records[id] = []
      }

      const related = relateds[record[this.id]]

      if (related) {
        records[id] = records[id].concat(related)
      }

      return records
    }, {} as Records)
  }

  /**
   * Create pivot records for the given records if needed.
   */
  createPivots (parent: typeof Model, data: NormalizedData, key: string): NormalizedData {
    Utils.forOwn(data[parent.entity], (record) => {
      const related = record[key]

      if (!Array.isArray(related)) {
        return
      }

      if (related.length === 0) {
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
      const pivotKey = `${id}_${parentId}_${this.related.entity}`

      data[this.pivot.entity] = {
        ...data[this.pivot.entity],

        [pivotKey]: {
          $id: pivotKey,
          [this.relatedId]: parentId,
          [this.id]: id,
          [this.type]: this.related.entity
        }
      }
    })
  }
}
