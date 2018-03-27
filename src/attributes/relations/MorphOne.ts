import { Record, NormalizedData, PlainCollection } from '../../data/Contract'
import Model from '../../model/Model'
import Query, { Relation as Load } from '../../query/Query'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class MorphOne extends Relation {
  /**
   * The related model.
   */
  related: typeof Model

  /**
   * The field name that contains id of the parent model.
   */
  id: string

  /**
   * The field name fthat contains type of the parent model.
   */
  type: string

  /**
   * The local key of the model.
   */
  localKey: string

  /**
   * Create a new belongs to instance.
   */
  constructor (model: typeof Model, related: Entity, id: string, type: string, localKey: string) {
    super(model) /* istanbul ignore next */

    this.related = this.model.relation(related)
    this.id = id
    this.type = type
    this.localKey = localKey
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
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  make (value: any, _parent: Record, _key: string): Model | null {
    if (value === null) {
      return null
    }

    if (value === undefined) {
      return null
    }

    if (Array.isArray(value)) {
      return null
    }

    return new this.related(value)
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
  load (query: Query, collection: PlainCollection, relation: Load): PlainCollection {
    const relatedQuery = new Query(query.rootState, this.related.entity, false)

    relatedQuery.where(this.type, query.entity)

    this.addConstraint(relatedQuery, relation)

    const relatedRecords = this.mapRecords(relatedQuery.get(), this.id)

    const relatedPath = this.relatedPath(relation.name)

    return collection.map((item) => {
      const related = relatedRecords[item[this.localKey]]

      return this.setRelated(item, related || null, relatedPath)
    })
  }
}
