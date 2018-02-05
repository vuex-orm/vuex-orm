import * as _ from '../../support/lodash'
import { Record, NormalizedData } from '../../Data'
import Model from '../../Model'
import { Collection } from '../Query'
import Repo, { Relation as Load } from '../Repo'
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
   * The related record.
   */
  records: Collection

  /**
   * Create a new belongs to instance.
   */
  constructor (
    related: Entity,
    pivot: Entity,
    foreignPivotKey: string,
    relatedPivotKey: string,
    parentKey: string,
    relatedKey: string,
    record: Collection,
    connection?: string
  ) {
    super()

    this.related = this.model(related, connection)
    this.pivot = this.model(pivot, connection)
    this.foreignPivotKey = foreignPivotKey
    this.relatedPivotKey = relatedPivotKey
    this.parentKey = parentKey
    this.relatedKey = relatedKey
    this.records = record
  }

  /**
   * Load the belongs to relationship for the record.
   */
  load (repo: Repo, record: Record, relation: Load): Collection {
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
  make (): Model[] {
    if (this.records.length === 0) {
      return []
    }

    if (typeof this.records[0] !== 'object') {
      return []
    }

    return this.records.map(record => new this.related(record))
  }

  /**
   * Create pivot records for the given records if needed.
   */
  createPivots (parent: typeof Model, data: NormalizedData): NormalizedData {
    _.forEach(data[parent.entity], (record) => {
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
