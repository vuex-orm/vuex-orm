import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../../schema/Schema'
import { Record, NormalizedData } from '../../../data/Data'
import Model from '../../Model'
import Relation from './Relation'

export default class HasOne extends Relation {
  /**
   * The foreign key of the parent model.
   */
  protected foreignKey: string

  /**
   * The local key of the parent model.
   */
  protected localKey: string

  /**
   * Create a new has one relation instance.
   */
  constructor(
    parent: Model,
    related: Model,
    foreignKey: string,
    localKey: string
  ) {
    super(parent, related)
    this.foreignKey = foreignKey
    this.localKey = localKey
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.one(this.related)
  }

  /**
   * Attach the relational key to the given data.
   */
  attach(id: string | number, record: Record, data: NormalizedData): void {
    const relatedRecord = data[this.related.$entity]?.[id]

    if (relatedRecord) {
      relatedRecord[this.foreignKey] = record[this.localKey]
    }
  }

  /**
   * Make the value for the attribute.
   */
  make(_value: any): null {
    return null
  }
}
