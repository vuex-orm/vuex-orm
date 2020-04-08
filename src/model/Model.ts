import { Store } from 'vuex'
import { Record } from '../data/Data'
import * as Attributes from './attributes/Attributes'

export interface Fields<M extends typeof Model> {
  [key: string]: Attributes.Attribute<M>
}

export default class Model {
  /**
   * The store instance.
   */
  protected _store!: Store<any>

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
  constructor(attributes?: Record) {
    this.$fill(attributes)
  }

  /**
   * Set the attribute to the schema.
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
   * Create a new attr attribute instance.
   */
  static attr<M extends typeof Model>(this: M, value: any): Attributes.Attr<M> {
    return new Attributes.Attr(this, value)
  }

  /**
   * Create a new string attribute instance.
   */
  static string<M extends typeof Model>(
    this: M,
    value: string | null
  ): Attributes.String<M> {
    return new Attributes.String(this, value)
  }

  /**
   * Create a new number attribute instance.
   */
  static number<M extends typeof Model>(
    this: M,
    value: number | null
  ): Attributes.Number<M> {
    return new Attributes.Number(this, value)
  }

  /**
   * Create a new boolean attribute instance.
   */
  static boolean<M extends typeof Model>(
    this: M,
    value: boolean | null
  ): Attributes.Boolean<M> {
    return new Attributes.Boolean(this, value)
  }

  /**
   * Get the constructor for the model.
   */
  get $self(): typeof Model {
    return this.constructor as typeof Model
  }

  /**
   * Get the store instance.
   */
  get $store(): Store<any> {
    return this._store
  }

  /**
   * Get the entity for the model.
   */
  get $entity(): string {
    return this.$self.entity
  }

  /**
   * Get the primary key for the model.
   */
  get $primaryKey(): string {
    return this.$self.primaryKey
  }

  /**
   * Set the store instance.
   */
  $setStore(store: Store<any>): this {
    this._store = store

    return this
  }

  /**
   * Create a new instance of the model. This method just provides a convenient
   * way for us to generate fresh model instances of this current model. It's
   * particularly useful during the hydration of new objects via the query.
   */
  $newInstance(attributes: Record): this {
    const model = this.$self as any

    return new model(attributes)
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
  $fill(attributes: Record = {}): this {
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
   * Get the index id for the model or the given record.
   */
  $getIndexId(record?: Record): string {
    const target = record ?? this

    return String(target[this.$primaryKey])
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
