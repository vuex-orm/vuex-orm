import Utils from '../../support/Utils'
import { Record, NormalizedData } from '../../data'
import BaseModel from '../../model/BaseModel'
import Query, { Relation as Load } from '../../query/Query'
import Relation from './Relation'

export type Entity = typeof BaseModel | string

export default class MorphedByMany extends Relation {
  /**
   * The related BaseModel.
   */
  related: typeof BaseModel

  /**
   * The pivot BaseModel.
   */
  pivot: typeof BaseModel

  /**
   * The field name that conatins id of the related BaseModel.
   */
  relatedId: string

  /**
   * The field name that contains id of the parent BaseModel.
   */
  id: string

  /**
   * The field name fthat contains type of the parent BaseModel.
   */
  type: string

  /**
   * The key name of the parent BaseModel.
   */
  parentKey: string

  /**
   * The key name of the related BaseModel.
   */
  relatedKey: string

  /**
   * Create a new belongs to instance.
   */
  constructor (
    model: typeof BaseModel,
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
   * Transform given data to the appropriate value. This method will be called
   * during data normalization to fix field that has an incorrect value,
   * or add a missing field with the appropriate default value.
   */
  fill (value: any): (string | number | Record)[] {
    return Array.isArray(value) ? value : []
  }

  /**
   * Make value to be set to BaseModel property. This method is used when
   * instantiating a BaseModel or creating a plain object from a BaseModel.
   */
  make (value: any, _parent: Record, _key: string): BaseModel[] {
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
   * Attach the relational key to the given record.
   */
  attach (_key: any, _record: Record, _data: NormalizedData): void {
    return
  }

  /**
   * Load the morph many relationship for the record.
   */
  load (query: Query, collection: Record[], relation: Load): Record[] {
    const relatedQuery = new Query(query.rootState, this.related.entity, false)

    this.addConstraint(relatedQuery, relation)

    const relatedRecords = relatedQuery.get().reduce((records, record) => {
      records[record[this.relatedKey]] = record

      return records
    }, {})

    const pivotQuery = new Query(query.rootState, this.pivot.entity, false)

    pivotQuery.where(this.type, relatedQuery.entity)

    const pivotRecords = pivotQuery.get().reduce((records, record) => {
      if (!records[record[this.relatedId]]) {
        records[record[this.relatedId]] = []
      }

      records[record[this.relatedId]].push(relatedRecords[record[this.id]])

      return records
    }, {} as any)

    const relatedPath = this.relatedPath(relation.name)

    return collection.map((item) => {
      const related = pivotRecords[item[this.parentKey]]

      return this.setRelated(item, related || [], relatedPath)
    })
  }

  /**
   * Create pivot records for the given records if needed.
   */
  createPivots (parent: typeof BaseModel, data: NormalizedData): NormalizedData {
    Utils.forOwn(data[parent.entity], (record) => {
      const related = record[this.related.entity]

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
