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
  static attr<M extends typeof Model>(this: M): Attributes.Attr<M> {
    return new Attributes.Attr(this)
  }

  /**
   * Create a new string attribute class.
   */
  static string<M extends typeof Model>(
    this: M,
    value: string | null
  ): Attributes.String<M> {
    return new Attributes.String(this, value)
  }

  /**
   * Create a new number attribute class.
   */
  static number<M extends typeof Model>(
    this: M,
    value: number | null
  ): Attributes.Number<M> {
    return new Attributes.Number(this, value)
  }

  /**
   * Create a new boolean attribute class.
   */
  static boolean<M extends typeof Model>(
    this: M,
    value: boolean | null
  ): Attributes.Boolean<M> {
    return new Attributes.Boolean(this, value)
  }

  /**
   * Get the index id from the given record. An index ID is a value that
   * used as a index key for records within the store.
   */
  static getIndexId(record: Record): string {
    return String(record[this.primaryKey])
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
  get $fields(): Fields<typeof Model> {
    return this.$self.schema
  }

  /**
   * Fill the model by the given attributes. Its default values will fill any
   * missing field.
   */
  $fill(attributes: Record): this {
    for (const key in this.$fields) {
      this.$fillField(key, attributes[key])
    }

    return this
  }

  private $fillField(key: string, value: any): void {
    const attr = this.$fields[key]

    if (value !== undefined) {
      this[key] = attr.make(value)
      return
    }

    if (this[key] !== undefined) {
      this[key] = this[key]
      return
    }

    this[key] = attr.make()
  }

  /**
   * Get the index id value for the model.
   */
  $getIndexId(): string {
    return this.$self.getIndexId(this)
  }

  /**
   * Get the serialized model attributes.
   */
  $getAttributes(): Record {
    const record = {} as Record

    for (const key in this.$fields) {
      record[key] = this[key]
    }

    return record
  }
}
