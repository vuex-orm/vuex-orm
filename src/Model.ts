import * as _ from 'lodash'
import { Schema as NormalizrSchema } from 'normalizr'
import Data, { NormalizedData } from './Data'
import Relation, { Relationship } from './Relation'
import Schema from './Schema'

export interface Fields {
  [field: string]: Relationship.BelongsTo
}

abstract class Model {
  /**
   * The name that is going be used as module name in Vuex Store.
   */
  static entity: string

  /**
   * The definition of the fields of the model and its relations.
   */
  static fields (): Fields {
    return {}
  }

  /**
   * Creates belongs to relationship.
   */
  static belongsTo (model: typeof Model, foreignKey: string): Relationship.BelongsTo {
    return Relation.belongsTo(model, foreignKey)
  }

  /**
   * Create normalizr schema that represents this model.
   *
   * @param {boolean} many If true, it'll return an array schema.
   */
  static schema (many: boolean = false): NormalizrSchema {
    return many ? Schema.many(this) : Schema.one(this)
  }

  /**
   * Generate normalized data from given data.
   */
  static normalize (data: any | any[]): NormalizedData {
    const schema = this.schema(_.isArray(data))

    return Data.normalize(data, schema)
  }
}

export default Model
