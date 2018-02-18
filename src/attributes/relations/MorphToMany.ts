import * as _ from '../../support/lodash'
import { Record, NormalizedData } from '../../data/Contract'
import Model from '../../model/Model'
import { Collection } from '../../repo/Query'
import Repo, { Relation as Load } from '../../repo/Repo'
import { Fields } from '../contracts/Contract'
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
   * The related record.
   */
  records: Collection = []

  /**
   * Create a new belongs to instance.
   */
  constructor (
    related: Entity,
    pivot: Entity,
    relatedId: string,
    id: string,
    type: string,
    parentKey: string,
    relatedKey: string,
    connection?: string
  ) {
    super(connection)

    this.related = this.model(related)
    this.pivot = this.model(pivot)
    this.relatedId = relatedId
    this.id = id
    this.type = type
    this.parentKey = parentKey
    this.relatedKey = relatedKey
  }

  /**
   * Return empty array if the value is not present.
   */
  fill (value: any): any {
    return value || []
  }

  /**
   * Load the morph many relationship for the record.
   */
  load (repo: Repo, record: Record, relation: Load): Collection {
    const pivotQuery = new Repo(repo.state, this.pivot.entity, false)

    const relatedItems = pivotQuery.where((rec: any) => {
      return rec[this.id] === record[this.parentKey]
    }).get()

    if (relatedItems.length === 0) {
      return []
    }

    const relatedIds = _.map(relatedItems, this.relatedId)

    const relatedQuery = new Repo(repo.state, this.related.entity, false)

    relatedQuery.where(this.relatedKey, (v: any) => _.includes(relatedIds, v))

    this.addConstraint(relatedQuery, relation)

    return relatedQuery.get()
  }

  /**
   * Make model instances of the relation.
   */
  make (_parent: Fields): Model[] {
    if (this.records.length === 0) {
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

      this.createPivotRecord(parent, data, record, related)
    })

    return data
  }

  /**
   * Create a pivot record.
   */
  createPivotRecord (parent: typeof Model, data: NormalizedData, record: Record, related: any[]): void {
    _.forEach(related, (id) => {
      const parentId = record[this.parentKey]
      const pivotKey = `${parentId}_${id}_${parent.entity}`

      data[this.pivot.entity] = {
        ...data[this.pivot.entity],

        [pivotKey]: {
          $id: pivotKey,
          [this.relatedId]: id,
          [this.id]: parentId,
          [this.type]: parent.entity
        }
      }
    })
  }
}
