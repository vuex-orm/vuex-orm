import { schema as Normalizr, Schema as NormalizrSchema } from 'normalizr'
import Model from '../model/Model'
import Relation from '../attributes/relations/Relation'
import Schemas from './Schemas'
import IdAttribute from './IdAttribute'
import ProcessStrategy from './ProcessStrategy'

export default class Schema {
  /**
   * List of generated schemas.
   */
  schemas: Schemas = {}

  /**
   * The model class.
   */
  model: typeof Model

  /**
   * Create a new schema instance.
   */
  constructor (model: typeof Model) {
    this.model = model

    const models = model.database().models()

    Object.keys(models).forEach((name) => { this.one(models[name]) })
  }

  /**
   * Create a schema for the given model.
   */
  static create (model: typeof Model): Normalizr.Entity {
    return (new this(model)).one()
  }

  /**
   * Create a single schema for the given model.
   */
  one (model?: typeof Model): Normalizr.Entity {
    model = model || this.model

    if (this.schemas[model.entity]) {
      return this.schemas[model.entity]
    }

    const schema = new Normalizr.Entity(model.entity, {}, {
      idAttribute: IdAttribute.create(model),
      processStrategy: ProcessStrategy.create(model)
    })

    this.schemas[model.entity] = schema

    const definition = this.definition(model)

    schema.define(definition)

    return schema
  }

  /**
   * Create an array schema for the given model.
   */
  many (model: typeof Model): Normalizr.Array {
    return new Normalizr.Array(this.one(model))
  }

  /**
   * Create an union schema for the given model.
   */
  union (callback: Normalizr.SchemaFunction): Normalizr.Union {
    return new Normalizr.Union(this.schemas, callback)
  }

  /**
   * Create a dfinition for the given model.
   */
  definition (model: typeof Model): NormalizrSchema {
    const fields = model.fields()

    return Object.keys(fields).reduce((definition, key) => {
      const field = fields[key]

      if (field instanceof Relation) {
        definition[key] = field.define(this)
      }

      return definition
    }, {} as NormalizrSchema)
  }
}
