import { schema as Normalizr, Schema as NormalizrSchema } from 'normalizr'
import { Relation } from '../model/attributes/Attributes'
import Model from '../model/Model'

interface Schemas {
  [entity: string]: Normalizr.Entity
}

export default class Schema {
  /**
   * List of generated schemas.
   */
  private schemas: Schemas = {}

  /**
   * The model instance.
   */
  private model: Model

  /**
   * Create a new schema instance.
   */
  constructor(model: Model) {
    this.model = model
  }

  /**
   * Create a single schema.
   */
  one(model?: Model): Normalizr.Entity {
    model = model || this.model

    if (this.schemas[model.$entity]) {
      return this.schemas[model.$entity]
    }

    const schema = this.newEntity(model)

    this.schemas[model.$entity] = schema

    const definition = this.definition(model)

    schema.define(definition)

    return schema
  }

  /**
   * Create an array schema for the given model.
   */
  many(model: Model): Normalizr.Array {
    return new Normalizr.Array(this.one(model))
  }

  /**
   * Create a new normalizr entity.
   */
  private newEntity(model: Model): Normalizr.Entity {
    const entity = model.$entity
    const idAttribute = this.idAttribute(model)

    return new Normalizr.Entity(entity, {}, { idAttribute })
  }

  /**
   * The id attribute option for the normalizr entity.
   */
  private idAttribute(model: Model): Normalizr.StrategyFunction<string> {
    return (record) => model.$getIndexId(record)
  }

  /**
   * Create a dfinition for the given model.
   */
  private definition(model: Model): NormalizrSchema {
    const definition: NormalizrSchema = {}

    for (const key in model.$fields) {
      const field = model.$fields[key]

      if (field instanceof Relation) {
        definition[key] = field.define(this)
      }
    }

    return definition
  }
}
