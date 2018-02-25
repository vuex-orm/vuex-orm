import * as _ from '../../support/lodash'
import { Record, NormalizedData, PlainCollection } from '../../data/Contract'
import Model from '../../model/Model'
import Repo, { Relation as Load } from '../../repo/Repo'
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
   * The related record.
   */
  records: PlainCollection = []

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
    super(model)

    this.related = this.model.relation(related)
    this.pivot = this.model.relation(pivot)
    this.relatedId = relatedId
    this.id = id
    this.type = type
    this.parentKey = parentKey
    this.relatedKey = relatedKey
  }

  /**
   * Normalize the given value. This method is called during data normalization
   * to generate appropriate value to be saved to Vuex Store.
   */
  normalize (value: any): any {
    return Array.isArray(value) ? value : []
  }

  /**
   * Return empty array if the value is not present.
   */
  fill (value: any): any {
    if (!Array.isArray(value)) {
      return []
    }

    return value.filter((record) => {
      return record && typeof record === 'object'
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
  load (repo: Repo, record: Record, relation: Load): PlainCollection {
    const pivotQuery = new Repo(repo.state, this.pivot.entity, false)

    const relatedItems = pivotQuery.where((rec: any) => {
      return rec[this.relatedId] === record[this.parentKey] && rec[this.type] === relation.name
    }).get()

    if (relatedItems.length === 0) {
      return []
    }

    const relatedIds = _.map(relatedItems, this.id)

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
