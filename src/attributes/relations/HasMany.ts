import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, NormalizedData } from '../../data'
import Model from '../../model/Model'
import Query, { Relation as Load } from '../../query/Query'
import Relation from './Relation'

export default class HasMany extends Relation {
  /**
   * The related model.
   */
  related: typeof Model

  /**
   * The foregin key of the related model.
   */
  foreignKey: string

  /**
   * The local key of the model.
   */
  localKey: string

  /**
   * Create a new has many instance.
   */
  constructor (model: typeof Model, related: typeof Model | string, foreignKey: string, localKey: string) {
    super(model) /* istanbul ignore next */

    this.related = this.model.relation(related)
    this.foreignKey = foreignKey
    this.localKey = localKey
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  define (schema: Schema): NormalizrSchema {
    return schema.many(this.related)
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
   * Attach the relational key to the given record.
   */
  attach (key: any, record: Record, data: NormalizedData): void {
    if (!Array.isArray(key)) {
      return
    }

    key.forEach((index: any) => {
      const related = data[this.related.entity]

      if (!related || !related[index] || related[index][this.foreignKey] !== undefined) {
        return
      }

      related[index][this.foreignKey] = record.$id
    })
  }

  /**
   * Load the has many relationship for the record.
   */
  load (query: Query, collection: Record[], relation: Load): Record[] {
    const localKeys = collection.map(record => record[this.localKey])

    const relatedQuery = query.newPlainQuery(this.related.entity)

    relatedQuery.where(this.foreignKey, localKeys)

    this.addConstraint(relatedQuery, relation)

    const relatedRecords = relatedQuery.get().reduce((records, record) => {
      const key = record[this.foreignKey]

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
