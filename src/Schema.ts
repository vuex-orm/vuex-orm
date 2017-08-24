import * as _ from 'lodash'
import { schema, Schema as NormalizrSchema } from 'normalizr'
import { Type as AttrType } from './Attributes'
import Model, { Fields } from './Model'

export default class Schema {
  /**
   * Create s schema of given model.
   */
  static one (model: typeof Model): schema.Entity {
    const definition = this.definition(model.fields())

    return new schema.Entity(model.entity, definition)
  }

  /**
   * Create a array schema of givene model.
   */
  static many (model: typeof Model): schema.Array {
    return new schema.Array(this.one(model))
  }

  /**
   * Create dfinition from given fields.
   */
  static definition (fields: Fields): NormalizrSchema {
    return _.reduce(fields, (definition, relation, key) => {
      if (relation.type === AttrType.BelongsTo) {
        definition[key] = this.one(relation.model)
      }

      return definition
    }, {} as { [key: string]: NormalizrSchema })
  }
}
