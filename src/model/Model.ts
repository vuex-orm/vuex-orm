import { Record } from '../data/Data'
import * as Attributes from './attributes/Attributes'

export interface Fields<M extends typeof Model> {
  [key: string]: Attributes.Attribute<M>
}

export default class Model {
  /**
   * The name of the model.
   */
  static entity: string

  /**
   * The primary key for the model.
   */
  static primaryKey: string = 'id'

  /**
   * The schema for the model. It contains the result of the `fields`
   * method or the attributes defined by decorators.
   */
  protected static schema: Fields<typeof Model> = {}

  /**
   * Create a new model instance.
   */
  constructor(record: Record) {
    this.$fill(record)
  }

  /**
   * Set the attribute.
   */
  static setSchema<M extends typeof Model>(
    this: M,
    key: string,
    attribute: Attributes.Attribute<M>
  ): M {
    this.schema[key] = attribute

    return this
  }

  /**
   * Create a new attr attribute class.
   */
  static attr<M extends typeof Model>(this: M): Attributes.Attribute<M> {
    return new Attributes.Attr(this)
  }

  /**
   * Get the index id from the given record. An index ID is a value that
   * used as a index key for records within the store.
   */
  static getIndexId(record: Record): string {
    return record[this.primaryKey]
  }

  /**
   * Get the constructor for the model.
   */
  get $self(): typeof Model {
    return this.constructor as typeof Model
  }

  /**
   * Get model fields for the model.
   */
  $fields(): Fields<typeof Model> {
    return this.$self.schema
  }

  /**
   * Fill the model by the given attributes. Its default values will fill any
   * missing field.
   */
  $fill(attributes: Record): this {
    const fields = this.$fields()

    for (const key in fields) {
      const attr = fields[key]
      const value = attributes[key]

      this[key] = attr.make(value)
    }

    return this
  }

  /**
   * Get the serialized model attributes.
   */
  $getAttributes(): Record {
    const fields = this.$fields()

    const record = {} as Record

    for (const key in fields) {
      const value = this[key]

      record[key] = value
    }

    return record
  }
}
