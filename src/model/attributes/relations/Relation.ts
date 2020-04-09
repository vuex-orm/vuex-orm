import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../../schema/Schema'
import { Record, NormalizedData, Collection } from '../../../data/Data'
import Query from '../../../query/Query'
import Model from '../../Model'
import Attribute from '../Attribute'

export interface Dictionaly {
  [id: string]: Model[]
}

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
   * Get the related model of the relation.
   */
  public getRelated(): Model {
    return this.related
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  abstract define(schema: Schema): NormalizrSchema

  /**
   * Attach the relational key to the given data.
   */
  abstract attach(ids: any, record: Record, data: NormalizedData): void

  /**
   * Set the constraints for an eager load of the relation.
   */
  abstract addEagerConstraints(query: Query, models: Collection): void

  /**
   * Get the relationship for eager loading.
   */
  public getEager(query: Query): Collection {
    return query.get()
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  abstract match(
    relation: string,
    models: Collection,
    results: Collection
  ): void

  /**
   * Get all of the primary keys for an array of models.
   */
  protected getKeys(models: Collection, key: string) {
    return models.map((model) => model[key])
  }

  /**
   * Run a dictionary map over the items.
   */
  protected mapToDictionary(
    models: Collection,
    callback: (model: Model) => [string, Model]
  ): Dictionaly {
    return models.reduce<Dictionaly>((dictionaly, model) => {
      const [key, value] = callback(model)

      if (!dictionaly[key]) {
        dictionaly[key] = []
      }

      dictionaly[key].push(value)

      return dictionaly
    }, {})
  }
}
