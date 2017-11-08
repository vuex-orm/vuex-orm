import { schema, Schema as NormalizrSchema } from 'normalizr'
import * as _ from './support/lodash'
import Attrs, { Type as AttrType } from './Attributes'
import Model, { Fields } from './Model'

export interface Schemas {
  [entity: string]: schema.Entity
}

export default class Schema {
  /**
   * Create s schema of given model.
   */
  static one (model: typeof Model, schemas: Schemas = {}): schema.Entity {
    const thisSchema = new schema.Entity(model.entity, {}, {
      idAttribute: model.primaryKey
    })

    const definition = this.definition(model, {
      ...schemas,
      [model.entity]: thisSchema
    })

    thisSchema.define(definition)

    return thisSchema
  }

  /**
   * Create a array schema of givene model.
   */
  static many (model: typeof Model, schemas: Schemas = {}): schema.Array {
    return new schema.Array(this.one(model, schemas))
  }

  /**
   * Create dfinition from given fields.
   */
  static definition (model: typeof Model, schemas: Schemas = {}): NormalizrSchema {
    return this.build(model, model.fields(), schemas)
  }

  /**
   * Build definition schema.
   */
  static build (model: typeof Model, fields: Fields, schemas: Schemas = {}): NormalizrSchema {
    return _.reduce(fields, (definition, field, key) => {
      if (!Attrs.isRelation(field)) {
        definition[key] = this.build(model, field, schemas)

        return definition
      }

      if (field.type === AttrType.HasOne || field.type === AttrType.BelongsTo) {
        const relation = model.resolveRelation(field)

        const s = schemas[relation.entity]

        definition[key] = s ? s : this.one(relation, schemas)

        return definition
      }

      if (field.type === AttrType.HasMany || field.type === AttrType.HasManyBy) {
        const relation = model.resolveRelation(field)

        const s = schemas[relation.entity]

        definition[key] = s ? new schema.Array(s) : this.many(relation, schemas)

        return definition
      }

      return definition
    }, {} as { [key: string]: NormalizrSchema })
  }
}
