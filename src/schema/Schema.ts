import * as _ from 'lodash'
import { schema, Schema as NormalizrSchema } from 'normalizr'
import * as Attributes from './Attributes'
import Model from '../Model'

export interface Fields {
  [key: string]: Attributes.Relationship
}

export interface Models {
  [name: string]: typeof Model
}

export interface NormalizableSchema {
  entity: NormalizrSchema
  models: Models
}

export default class Schema {
  /**
   * Empty schema object.
   */
  static emptySchema: NormalizableSchema = { entity: {}, models: {} }

  /**
   * Create a normalizr schema from the given Model.
   */
  static one (model: typeof Model, difinition?: NormalizableSchema, name?: string): NormalizableSchema {
    return this.create(model, difinition, name)
  }

  /**
   * Create a normalizr array schema from the given model.
   */
  static many (model: typeof Model, difinition?: NormalizableSchema, name?: string): NormalizableSchema {
    return this.create(model, difinition, name, true)
  }

  /**
   * Create one or many schema.
   */
  static create (
     model: typeof Model,
     difinition: NormalizableSchema = this.emptySchema,
     name?: string,
     many?: boolean
   ): NormalizableSchema {
    const schema: NormalizableSchema = this.definition(model, difinition)

    return {
      entity: this[many ? 'array' : 'entity'](model, schema.entity, name || model.entity),
      models: this.models(model, schema.models)
    }
  }

  /**
   * Create definition from model relationship.
   */
  static definition (model: typeof Model, difinition?: NormalizableSchema): NormalizableSchema {
    let schema: NormalizableSchema = { ...difinition }

    _.forEach(model.fields(), (field: Attributes.Relationship, key: string): void => {
      if (field.type === Attributes.ATTR) {
        return
      }

      if (field.type === Attributes.BELONGS_TO) {
        schema = this.one(field.related, schema, key)
      }
    })

    return schema
  }

  /**
   * Create single entity.
   */
  static entity (model: typeof Model, difinition: NormalizrSchema, name?: string): NormalizrSchema {
    const entity = new schema.Entity(model.entity, difinition, {
      idAttribute: model.primaryKey
    })

    return this.wrap(entity, name)
  }

  /**
   * Create array of entity.
   */
  static array (model: typeof Model, difinition: NormalizrSchema, name?: string): NormalizrSchema {
    const entity = this.entity(model, difinition)

    const arrayEntity = new schema.Array(entity)

    return this.wrap(arrayEntity, name)
  }

  /**
   * Wrap entity with given name. If name is empty, it will return entity as is.
   */
  static wrap (entity: NormalizrSchema, name?: string): NormalizrSchema {
    return name ? { [name]: entity } : entity
  }

  /**
   * Create new models by merging given model and models.
   */
  static models (model: typeof Model, models: Models): Models {
    return { ...models, [model.entity]: model }
  }
}
