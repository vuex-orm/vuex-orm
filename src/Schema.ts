import { schema, Schema as NormalizrSchema } from 'normalizr'
import * as _ from './support/lodash'
import { Record } from './Data'
import Attrs, { Field, Fields } from './repo/Attribute'
import Relations from './repo/Relations'
import HasOne from './repo/relations/HasOne'
import BelongsTo from './repo/relations/BelongsTo'
import HasMany from './repo/relations/HasMany'
import HasManyBy from './repo/relations/HasManyBy'
import BelongsToMany from './repo/relations/BelongsToMany'
import MorphTo from './repo/relations/MorphTo'
import MorphOne from './repo/relations/MorphOne'
import MorphMany from './repo/relations/MorphMany'
import MorphToMany from './repo/relations/MorphToMany'
import MorphedByMany from './repo/relations/MorphedByMany'
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
  static one (model: typeof Model, schemas: Schemas = {}, parent?: typeof Model, attr?: Relations): schema.Entity {
    const thisSchema = new schema.Entity(model.entity, {}, {
      idAttribute: this.idAttribute(model),
      processStrategy: this.processStrategy(model, parent, attr)
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
  static many (model: typeof Model, schemas: Schemas = {}, parent?: typeof Model, attr?: Relations): schema.Array {
    return new schema.Array(this.one(model, schemas, parent, attr))
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
      return this.buildOne(field.related, schemas, model, field)
    }

    if (field instanceof BelongsTo) {
      return this.buildOne(field.parent, schemas, model, field)
    }

    if (field instanceof HasMany) {
      return this.buildMany(field.related, schemas, model, field)
    }

    if (field instanceof HasManyBy) {
      return this.buildMany(field.parent, schemas, model, field)
    }

    if (field instanceof BelongsToMany) {
      return this.buildMany(field.related, schemas, model, field)
    }

    if (field instanceof MorphTo) {
      return this.buildMorphOne(field, schemas, model)
    }

    if (field instanceof MorphOne) {
      return this.buildOne(field.related, schemas, model, field)
    }

    if (field instanceof MorphMany) {
      return this.buildMany(field.related, schemas, model, field)
    }

    if (field instanceof MorphToMany) {
      return this.buildMany(field.related, schemas, model, field)
    }

    if (field instanceof MorphedByMany) {
      return this.buildMany(field.related, schemas, model, field)
    }

    return null
  }

  /**
   * Build a single entity schema definition.
   */
  static buildOne (related: typeof Model, schemas: Schemas, parent: typeof Model, attr: Relations): schema.Entity {
    const s = schemas[related.entity]

    return s || this.one(related, schemas, parent, attr)
  }

  /**
   * Build a array entity schema definition.
   */
  static buildMany (related: typeof Model, schemas: Schemas, parent: typeof Model, attr: Relations): schema.Array {
    const s = schemas[related.entity]

    return s ? new schema.Array(s) : this.many(related, schemas, parent, attr)
  }

  /**
   * Build a morph schema definition.
   */
  static buildMorphOne (attr: MorphTo, schemas: Schemas, parent: typeof Model) {
    const s = _.mapValues(parent.conn().models(), (model) => {
      return this.buildOne(model, schemas, model, attr)
    })

    return new schema.Union(s, (_value, parentValue) => parentValue[attr.type])
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
  static processStrategy (model: typeof Model, parent?: typeof Model, attr?: Relations): ProcessStrategy {
    return (value: any, parentValue: any, _key: string) => {
      let record: Record = { ...value, $id: model.id(value) }

      record = this.generateMorphFields(record, parentValue, parent, attr)

      return record
    }
  }

  /**
   * Generate morph fields. This method will generate fileds needed for the
   * morph fields such as `commentable_id` and `commentable_type`.
   */
  static generateMorphFields (record: Record, parentValue: any, parent?: typeof Model, attr?: Relations): Record {
    if (attr === undefined) {
      return record
    }

    if (!Attrs.isMorphRelation(attr)) {
      return record
    }

    if (parent === undefined) {
      return record
    }

    return {
      [attr.id]: parentValue.$id,
      [attr.type]: parent.entity,
      ...record
    }
  }
}
