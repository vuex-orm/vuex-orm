import { schema, Schema as NormalizrSchema } from 'normalizr'
import * as _ from './support/lodash'
import Attrs, { Field, Fields } from './repo/Attribute'
import HasOne from './repo/relations/HasOne'
import BelongsTo from './repo/relations/BelongsTo'
import HasMany from './repo/relations/HasMany'
import HasManyBy from './repo/relations/HasManyBy'
import BelongsToMany from './repo/relations/BelongsToMany'
import Model from './Model'

export type IdAttribute = (value: any, parent: any, key: string) => any

export type ProcessStrategy = (value: any, parent: any, key: string) => any

export interface Schemas {
  [entity: string]: schema.Entity
}

export default class Schema {
  /**
   * Count to create unique id for record that missing its primary key.
   */
  static count: number = 0

  /**
   * Create a schema of given model.
   */
  static one (model: typeof Model, schemas: Schemas = {}): schema.Entity {
    const thisSchema = new schema.Entity(model.entity, {}, {
      idAttribute: this.idAttribute(model),
      processStrategy: this.processStrategy(model)
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
   * Create a dfinition from given fields.
   */
  static definition (model: typeof Model, schemas: Schemas): NormalizrSchema {
    return this.build(model, model.fields(), schemas)
  }

  /**
   * Build a definition schema.
   */
  static build (model: typeof Model, fields: Fields, schemas: Schemas): NormalizrSchema {
    return _.reduce(fields, (definition, field, key) => {
      const def = this.buildRelations(model, field, schemas)

      if (def) {
        definition[key] = def
      }

      return definition
    }, {} as { [key: string]: NormalizrSchema })
  }

  /**
   * Build normalizr schema definition from the given relation.
   */
  static buildRelations (model: typeof Model, field: Field, schemas: Schemas): NormalizrSchema | null {
    if (!Attrs.isAttribute(field)) {
      return this.build(model, field, schemas)
    }

    if (field instanceof HasOne) {
      return this.buildOne(field.related, schemas)
    }

    if (field instanceof BelongsTo) {
      return this.buildOne(field.parent, schemas)
    }

    if (field instanceof HasMany) {
      return this.buildMany(field.related, schemas)
    }

    if (field instanceof HasManyBy) {
      return this.buildMany(field.parent, schemas)
    }

    if (field instanceof BelongsToMany) {
      return this.buildMany(field.related, schemas)
    }

    return null
  }

  /**
   * Build a single entity schema definition.
   */
  static buildOne (related: typeof Model, schemas: Schemas): schema.Entity {
    const s = schemas[related.entity]

    return s || this.one(related, schemas)
  }

  /**
   * Build a array entity schema definition.
   */
  static buildMany (related: typeof Model, schemas: Schemas): schema.Array {
    const s = schemas[related.entity]

    return s ? new schema.Array(s) : this.many(related, schemas)
  }

  /**
   * Create the merge strategy.
   */
  static idAttribute (model: typeof Model): IdAttribute {
    return (value: any, _parent: any, _key: string) => {
      const id = model.id(value)

      return id !== undefined ? id : `_no_key_${this.count++}`
    }
  }

  /**
   * Create the process strategy.
   */
  static processStrategy (model: typeof Model): ProcessStrategy {
    return (value: any, _parent: any, _key: string) => {
      return { ...value, $id: model.id(value) }
    }
  }
}
