import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../../schema/Schema'
import { Record, NormalizedData } from '../../../data/Data'
import Model from '../../Model'
import Attribute from '../Attribute'

export default abstract class Relation extends Attribute {
  /**
   * The parent model.
   */
  protected parent: Model

  /**
   * The related model.
   */
  protected related: Model

  /**
   * Create a new relation instance.
   */
  constructor(parent: Model, related: Model) {
    super(parent)
    this.parent = parent
    this.related = related
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  abstract define(schema: Schema): NormalizrSchema

  /**
   * Attach the relational key to the given data.
   */
  abstract attach(ids: any, record: Record, data: NormalizedData): void
}
