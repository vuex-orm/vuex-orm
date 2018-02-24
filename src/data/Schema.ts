import { schema, Schema as NormalizrSchema } from 'normalizr'
import * as _ from '../support/lodash'
import Model from '../model/Model'
import Attrs, { Field, Fields, Relation } from '../attributes/contracts/Contract'
import HasOne from '../attributes/relations/HasOne'
import BelongsTo from '../attributes/relations/BelongsTo'
import HasMany from '../attributes/relations/HasMany'
import HasManyBy from '../attributes/relations/HasManyBy'
import HasManyThrough from '../attributes/relations/HasManyThrough'
import BelongsToMany from '../attributes/relations/BelongsToMany'
import MorphTo from '../attributes/relations/MorphTo'
import MorphOne from '../attributes/relations/MorphOne'
import MorphMany from '../attributes/relations/MorphMany'
import MorphToMany from '../attributes/relations/MorphToMany'
import MorphedByMany from '../attributes/relations/MorphedByMany'
import IdAttribute from './IdAttribute'
import ProcessStrategy from './ProcessStrategy'

export interface Schemas {
  [entity: string]: schema.Entity
}

export default class Schema {
  /**
   * Create a schema of given model.
   */
  static one (model: typeof Model, schemas: Schemas = {}, parent?: typeof Model, attr?: Relation): schema.Entity {
    const thisSchema = new schema.Entity(model.entity, {}, {
      idAttribute: IdAttribute.create(model),
      processStrategy: ProcessStrategy.create(model, parent, attr)
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
  static many (model: typeof Model, schemas: Schemas = {}, parent?: typeof Model, attr?: Relation): schema.Array {
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

    if (field instanceof HasManyThrough) {
      return this.buildMany(field.related, schemas, model, field)
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
  static buildOne (related: typeof Model, schemas: Schemas, parent: typeof Model, attr: Relation): schema.Entity {
    const s = schemas[related.entity]

    return s || this.one(related, schemas, parent, attr)
  }

  /**
   * Build a array entity schema definition.
   */
  static buildMany (related: typeof Model, schemas: Schemas, parent: typeof Model, attr: Relation): schema.Array {
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
}
