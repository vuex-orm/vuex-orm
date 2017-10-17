import * as _ from 'lodash'
import { schema, Schema as NormalizrSchema } from 'normalizr'
import { Type as AttrType, BelongsTo, HasMany } from './Attributes'
import Model from './Model'

export default class Schema {
  /**
   * Create s schema of given model.
   */
  static one (model: typeof Model): schema.Entity {
    const definition = this.definition(model)

    return new schema.Entity(model.entity, definition, {
      idAttribute: model.primaryKey
    })
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
  static definition (model: typeof Model): NormalizrSchema {
    return _.reduce(model.fields(), (definition, relation, key) => {
      if (relation.type === AttrType.BelongsTo) {
        definition[key] = this.one(model.resolveRelation(relation as BelongsTo))

        return definition
      }

      if (relation.type === AttrType.HasMany) {
        definition[key] = this.many(model.resolveRelation(relation as HasMany))

        return definition
      }

      return definition
    }, {} as { [key: string]: NormalizrSchema })
  }
}
