import { Record, NormalizedData } from '../../data'
import BaseModel from '../../model/BaseModel'
import Query, { Relation as Load } from '../../query/Query'
import Relation from './Relation'

export type Entity = typeof BaseModel | string

export default class MorphTo extends Relation {
  /**
   * The field name that contains id of the parent BaseModel.
   */
  id: string

  /**
   * The field name fthat contains type of the parent BaseModel.
   */
  type: string

  /**
   * Create a new morph to instance.
   */
  constructor (model: typeof BaseModel, id: string, type: string) {
    super(model) /* istanbul ignore next */

    this.id = id
    this.type = type
  }

  /**
   * Transform given data to the appropriate value. This method will be called
   * during data normalization to fix field that has an incorrect value,
   * or add a missing field with the appropriate default value.
   */
  fill (value: any): string | number | null | Record {
    if (value === undefined) {
      return null
    }

    if (Array.isArray(value)) {
      return null
    }

    return value
  }

  /**
   * Make value to be set to BaseModel property. This method is used when
   * instantiating a BaseModel or creating a plain object from a BaseModel.
   */
  make (value: any, parent: Record, _key: string): BaseModel | null {
    if (value === null) {
      return null
    }

    if (value === undefined) {
      return null
    }

    if (Array.isArray(value)) {
      return null
    }

    const related: string = parent[this.type]
    const BaseModel = this.model.relation(related)

    return BaseModel ? new BaseModel(value) : null
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
    const relatedRecords = Object.keys(query.getModels()).reduce((records, name) => {
      if (name === query.entity) {
        return records
      }

      const relatedQuery = new Query(query.rootState, name, false)

      this.addConstraint(relatedQuery, relation)

      records[name] = this.mapRecords(relatedQuery.get(), '$id')

      return records
    }, {} as { [name: string]: { [id: string]: any } })

    const relatedPath = this.relatedPath(relation.name)

    return collection.map((item) => {
      const related = relatedRecords[item[this.type]][item[this.id]]

      return this.setRelated(item, related || null, relatedPath)
    })
  }
}
