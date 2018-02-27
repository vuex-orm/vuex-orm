import * as _ from '../../support/lodash'
import { Record, NormalizedData, PlainCollection } from '../../data/Contract'
import Model from '../../model/Model'
import Repo, { Relation as Load } from '../../repo/Repo'
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
   * Create a new belongs to instance.
   */
  constructor (
    model: typeof Model,
    related: Entity,
    pivot: Entity,
    foreignPivotKey: string,
    relatedPivotKey: string,
    parentKey: string,
    relatedKey: string
  ) {
    super(model)

    this.related = this.model.relation(related)
    this.pivot = this.model.relation(pivot)
    this.foreignPivotKey = foreignPivotKey
    this.relatedPivotKey = relatedPivotKey
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
   * Attach the relational key to the given record.
   */
  attach (_key: any, _record: Record, _data: NormalizedData): void {
    return
  }

  /**
   * Load the belongs to relationship for the record.
   */
  load (repo: Repo, record: Record, relation: Load): PlainCollection {
    const pivotQuery = new Repo(repo.state, this.pivot.entity, false)

    const relatedItems = pivotQuery.where((rec: any) => {
      return rec[this.foreignPivotKey] === record[this.parentKey]
    }).get()

    if (relatedItems.length === 0) {
      return []
    }

    const relatedIds = _.map(relatedItems, this.relatedPivotKey)

    const relatedQuery = new Repo(repo.state, this.related.entity, false)

    relatedQuery.where(this.relatedKey, (v: any) => _.includes(relatedIds, v))

    this.addConstraint(relatedQuery, relation)

    return relatedQuery.get()
  }

  /**
   * Make model instances of the relation.
   */
  make (value: any, _parent: Record, _key: string): Model[] {
    if (value.length === 0) {
      return []
    }

    return value.map((record: any) => new this.related(record))
  }

  /**
   * Create pivot records for the given records if needed.
   */
  createPivots (parent: typeof Model, data: NormalizedData): NormalizedData {
    _.forEach(data[parent.entity], (record) => {
      const related = record[this.related.entity]

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
    _.forEach(related, (id) => {
      const pivotKey = `${record[this.parentKey]}_${id}`

      data[this.pivot.entity] = {
        ...data[this.pivot.entity],

        [pivotKey]: {
          $id: pivotKey,
          [this.foreignPivotKey]: record[this.parentKey],
          [this.relatedPivotKey]: id
        }
      }
    })
  }
}
