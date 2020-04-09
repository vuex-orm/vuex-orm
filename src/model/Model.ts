import { Store } from 'vuex'
import { isObject } from '../support/Utils'
import { Record } from '../data/Data'
import * as Attributes from './attributes/Attributes'

export interface Fields {
  [key: string]: Attributes.Attribute
}

interface Schemas {
  [name: string]: Fields
}

interface Registries {
  [name: string]: Registry
}

interface Registry {
  [key: string]: () => Attributes.Attribute
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
  protected static schemas: Schemas = {}

  /**
   * The registry for the model. It contains predefined model schema generated
   * by the decorators, and gets evaluated and stored at `schema` property
   * when registering models to the database
   */
  protected static registries: Registries = {}

  /**
   * The array of booted models.
   */
  protected static booted: { [name: string]: boolean } = {}

  /**
   * Create a new model instance.
   */
  constructor(attributes?: Record) {
    this.$boot()

    this.$fill(attributes)
  }

  /**
   * Build a schema by evaluating fields and registry.
   */
  static initializeSchema(): void {
    this.schemas[this.entity] = {}

    const registry = this.registries[this.entity]

    for (const key in registry) {
      this.schemas[this.entity][key] = registry[key]()
    }
  }

  /**
   * Set the attribute to the registry.
   */
  static setRegistry(
    key: string,
    attribute: () => Attributes.Attribute
  ): typeof Model {
    if (!this.registries[this.entity]) {
      this.registries[this.entity] = {}
    }

    this.registries[this.entity][key] = attribute

    return this
  }

  /**
   * Clear the list of booted models so they will be re-booted.
   */
  static clearBootedModels(): void {
    this.booted = {}
    this.schemas = {}
  }

  /**
   * Create a new attr attribute instance.
   */
  static attr(value: any): Attributes.Attr {
    return new Attributes.Attr(new this(), value)
  }

  /**
   * Create a new string attribute instance.
   */
  static string(value: string | null): Attributes.String {
    return new Attributes.String(new this(), value)
  }

  /**
   * Create a new number attribute instance.
   */
  static number(value: number | null): Attributes.Number {
    return new Attributes.Number(new this(), value)
  }

  /**
   * Create a new boolean attribute instance.
   */
  static boolean(value: boolean | null): Attributes.Boolean {
    return new Attributes.Boolean(new this(), value)
  }

  /**
   * Create a new has one relation instance.
   */
  static hasOne(
    related: typeof Model,
    foreignKey: string,
    localKey?: string
  ): Attributes.HasOne {
    localKey = localKey ?? this.getLocalKey()

    return new Attributes.HasOne(
      new this(),
      new related(),
      foreignKey,
      localKey
    )
  }

  /**
   * Get the local key for the model.
   */
  static getLocalKey(): string {
    return this.primaryKey
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
    const model = new this.$self(attributes) as this

    model.$setStore(model.$store)

    return model
  }

  /**
   * Get model fields for the model.
   */
  get $fields(): Fields {
    return this.$self.schemas[this.$entity]
  }

  /**
   * Bootstrap the model.
   */
  protected $boot(): void {
    if (!this.$self.booted[this.$entity]) {
      this.$self.booted[this.$entity] = true

      this.$initializeSchema()
    }
  }

  /**
   * Build a schema by evaluating fields and registry.
   */
  protected $initializeSchema(): void {
    this.$self.initializeSchema()
  }

  /**
   * Fill the model by the given attributes. Its default values will fill any
   * missing field.
   */
  $fill(attributes: Record = {}): this {
    for (const key in this.$fields) {
      const attr = this.$fields[key]
      const value = attributes[key]

      attr instanceof Attributes.Relation
        ? this.$fillRelationFields(key, attr, value)
        : this.$fillTypeField(key, attr, value)
    }

    return this
  }

  /**
   * Fill type attribute filed.
   */
  protected $fillTypeField(
    key: string,
    attr: Attributes.Attribute,
    value: any
  ): void {
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
   * Fill relation attribute filed.
   */
  protected $fillRelationFields(
    key: string,
    attr: Attributes.Relation,
    value: any
  ): void {
    if (isObject(value)) {
      this[key] = attr.make(value)
    }
  }

  /**
   * Get the primary key field name.
   */
  $getPrimaryKey(): string {
    return this.$primaryKey
  }

  /**
   * Get the index id for the model or the given record.
   */
  $getIndexId(record?: Record): string {
    const target = record ?? this

    return String(target[this.$primaryKey])
  }

  /**
   * Check if the model has any relations defined in the schema.
   */
  $hasRelation(): boolean {
    let result = false

    for (const key in this.$fields) {
      if (this.$fields[key] instanceof Attributes.Relation) {
        result = true
      }
    }

    return result
  }

  /**
   * Get the relation instance for the given relation name.
   */
  $getRelation(name: string): Attributes.Relation {
    const relation = this.$fields[name]

    if (!(relation instanceof Attributes.Relation)) {
      throw new Error(
        `[Vuex ORM] Relationship [${name}] on model [${this.$entity}] not found.`
      )
    }

    return relation
  }

  /**
   * Set the given relationship on the model.
   */
  $setRelation(relation: string, model: Model | Model[] | null): this {
    this[relation] = model

    return this
  }

  /**
   * Get the serialized model attributes.
   */
  $getAttributes(): Record {
    const record = {} as Record

    for (const key in this.$fields) {
      if (this[key] !== undefined) {
        record[key] = this[key]
      }
    }

    return record
  }
}
