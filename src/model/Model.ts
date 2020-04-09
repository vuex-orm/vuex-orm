import { Store } from 'vuex'
import { Element } from '../data/Data'
import { Attribute } from './attributes/Attribute'
import { Attr } from './attributes/types/Attr'
import { String as Str } from './attributes/types/String'
import { Number as Num } from './attributes/types/Number'
import { Boolean as Bool } from './attributes/types/Boolean'
import { Relation } from './attributes/relations/Relation'
import { HasOne } from './attributes/relations/HasOne'
import { HasMany } from './attributes/relations/HasMany'

export type ModelFields = Record<string, Attribute>
export type ModelSchemas = Record<string, ModelFields>
export type ModelRegistries = Record<string, ModelRegistry>
export type ModelRegistry = Record<string, () => Attribute>

export interface ModelOptions {
  relations?: boolean
}

export class Model {
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
  protected static schemas: ModelSchemas = {}

  /**
   * The registry for the model. It contains predefined model schema generated
   * by the decorators, and gets evaluated and stored at `schema` property
   * when registering models to the database
   */
  protected static registries: ModelRegistries = {}

  /**
   * The array of booted models.
   */
  protected static booted: { [name: string]: boolean } = {}

  /**
   * Create a new model instance.
   */
  constructor(attributes?: Element, options?: ModelOptions) {
    this.$boot()

    this.$fill(attributes, options)
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
  static setRegistry(key: string, attribute: () => Attribute): typeof Model {
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
  static attr(value: any): Attr {
    return new Attr(new this(), value)
  }

  /**
   * Create a new string attribute instance.
   */
  static string(value: string | null): Str {
    return new Str(new this(), value)
  }

  /**
   * Create a new number attribute instance.
   */
  static number(value: number | null): Num {
    return new Num(new this(), value)
  }

  /**
   * Create a new boolean attribute instance.
   */
  static boolean(value: boolean | null): Bool {
    return new Bool(new this(), value)
  }

  /**
   * Create a new has one relation instance.
   */
  static hasOne(
    related: typeof Model,
    foreignKey: string,
    localKey?: string
  ): HasOne {
    localKey = localKey ?? this.getLocalKey()

    return new HasOne(new this(), new related(), foreignKey, localKey)
  }

  /**
   * Create a new has many relation instance.
   */
  static hasMany(
    related: typeof Model,
    foreignKey: string,
    localKey?: string
  ): HasMany {
    localKey = localKey ?? this.getLocalKey()

    return new HasMany(new this(), new related(), foreignKey, localKey)
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
  $newInstance(attributes?: Element, options?: ModelOptions): this {
    const model = new this.$self(attributes, options) as this

    model.$setStore(model.$store)

    return model
  }

  /**
   * Get model fields for the model.
   */
  get $fields(): ModelFields {
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
   * Fill the model by the given  Its default values will fill any
   * missing field.
   */
  $fill(attributes: Element = {}, options: ModelOptions = {}): this {
    const fillRelation = options.relations ?? true

    for (const key in this.$fields) {
      const attr = this.$fields[key]
      const value = attributes[key]

      if (attr instanceof Relation && !fillRelation) {
        continue
      }

      this.$fillField(key, attr, value)
    }

    return this
  }

  /**
   * Fill the model filed.
   */
  protected $fillField(key: string, attr: Attribute, value: any): void {
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
   * Get the primary key field name.
   */
  $getPrimaryKey(): string {
    return this.$primaryKey
  }

  /**
   * Get the index id for the model or the given record.
   */
  $getIndexId(record?: Element): string {
    const target = record ?? this

    return String(target[this.$primaryKey])
  }

  /**
   * Check if the model has any relations defined in the schema.
   */
  $hasRelation(): boolean {
    let result = false

    for (const key in this.$fields) {
      if (this.$fields[key] instanceof Relation) {
        result = true
      }
    }

    return result
  }

  /**
   * Get the relation instance for the given relation name.
   */
  $getRelation(name: string): Relation {
    const relation = this.$fields[name]

    if (!(relation instanceof Relation)) {
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
  $getAttributes(): Element {
    const record = {} as Element

    for (const key in this.$fields) {
      if (this[key] !== undefined) {
        record[key] = this[key]
      }
    }

    return record
  }
}
