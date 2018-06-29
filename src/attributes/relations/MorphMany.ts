import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, NormalizedData } from '../../data'
import Model from '../../model/Model'
import Query, { Relation as Load } from '../../query/Query'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class MorphMany extends Relation {
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
   * Define the normalizr schema for the relationship.
   */
  define (schema: Schema): NormalizrSchema {
    return schema.many(this.related)
  }

  /**
   * Attach the relational key to the given data.
   */
  attach (key: any, record: Record, data: NormalizedData): void {
    const relatedItems = data[this.related.entity]

    key.forEach((id: any) => {
      const relatedItem = relatedItems[id]

      relatedItem[this.id] = relatedItem[this.id] || record.$id
      relatedItem[this.type] = relatedItem[this.type] || this.model.entity
    })
  }

  /**
   * Validate the given value to be a valid value for the relationship.
   */
  fill (value: any): (string | number)[] {
    return this.fillMany(value)
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  make (value: any, _parent: Record, _key: string, plain: boolean = false): Model[] | Record[] {
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
      return this.related.make(record, plain)
    })
  }

  /**
   * Load the morph many relationship for the record.
   */
  load (query: Query, collection: Record[], relation: Load): Record[] {
    const relatedQuery = new Query(query.rootState, this.related.entity, false)

    relatedQuery.where(this.type, query.entity)

    this.addConstraint(relatedQuery, relation)

    const relatedRecords = relatedQuery.get().reduce((records, record) => {
      const key = record[this.id]

      if (!records[key]) {
        records[key] = []
      }

      records[key].push(record)

      return records
    }, {} as { [id: string]: Record[] })

    const relatedPath = this.relatedPath(relation.name)

    return collection.map((item) => {
      const related = relatedRecords[item[this.localKey]]

      return this.setRelated(item, related || [], relatedPath)
    })
  }
}
