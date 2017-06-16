import * as _ from 'lodash'
import Vuex from 'vuex'
import VuexModulable from './contracts/VuexModulable'
import * as Attributes from './schema/Attributes'
import Schema, * as SchemaTypes from './schema/Schema'
import * as Data from './data/Data'
import Normalizer from './data/Normalizer'
import state, { State } from './modules/state'
import actions from './modules/actions'
import mutations from './modules/mutations'
import Container from './connections/Container'
import Connection from './connections/Connection'
import Workspace from './Workspace'

export default class Model implements VuexModulable {
  /**
   * Connection name to be used to access store.
   */
  static connection: string

  /**
   * Name of the entity. This value will be used as namespace for the
   * Vuex Store state.
   */
  static entity: string

  /**
   * The primary key for the model. This value will be used as determining
   * the endpoint of the request for `save` (which is typically `update`
   * and `delete` request).
   */
  static primaryKey: string = 'id'

  /**
   * The workspace class to be used with this model.
   */
  static Workspace: typeof Workspace | null = Workspace

  /**
   * Dynamic property on fields that will be assigned on class initialization.
   */
  ;[field: string]: any

  /**
   * Create new model instance.
   *
   * If `data` is passed, it'll be used as default value of the models fields.
   * (which will become the properties of the instantiated model instance).
   *
   * Note that the `data` doesn't have to match models `static fields ()`
   * schema. Regardless of the absence of the models fields, the given
   * `data` will always be set to the model instance.
   *
   * So when the model has for example following fields;
   *
   *     class User extends Model {
   *       static fields () {
   *         name: this.attr(''),
   *         email: this.attr('')
   *       }
   *     }
   *
   * And if following `data` was passed;
   *
   *     const user = new User({
   *       name: 'John Doe',
   *       sex: 'male'
   *     })
   *
   * Then the initialized model will have following fields.
   *
   *     user.name  // <- 'John Doe'
   *     user.email // <- ''
   *     user.sex   // <- 'male'
   *
   * Notice that the "email" field wasn't present in `data` but it still is
   * there because it was defined in models `static fields ()`.
   *
   * If you pass `false` to `full` argument, only the fields within given
   * `data` will be initialized.
   *
   *     const user = new User({ name: 'Jane Doe' }, false)
   *
   *     user.name  // <- 'Jane Doe'
   *     user.email // <- undefined
   */
  constructor (data: Data.Data = {}, full: boolean = true) {
    // First lets merge given data with models defined fields and get
    // brand new field set!
    const fields: SchemaTypes.Fields = this.initializeFields(data, full)

    // Then let's initialize this bad boy!
    this.initialize(fields)
  }

  /**
   * DB schema represented fields. It takes key as the name of the field,
   * and value as the value. If you set this on the subclass, it will be
   * automatically accessible as instance properties.
   */
  static fields (): SchemaTypes.Fields {
    return {}
  }

  /**
   * Create normal attribute field.
   */
  static attr (value: any): Attributes.Attr {
    return Attributes.attr(value)
  }

  /**
   * Create belongsTo relationship field.
   */
  static belongsTo (related: typeof Model, foreignKey: string, otherKey: string = 'id'): Attributes.BelongsTo {
    return Attributes.belongsTo(related, foreignKey, otherKey)
  }

  /**
   * Create schema to normalize data tree.
   */
  static schema (many?: boolean): SchemaTypes.NormalizableSchema {
    return many ? Schema.many(this) : Schema.one(this)
  }

  /**
   * Normalize data.
   */
  static normalize (data: Data.Data | Data.Data[], wrap: boolean = true): Data.NormalizedData {
    return Normalizer.normalize(data, this, wrap)
  }

  /**
   * Initial state to be registered to Vuex Store.
   */
  static state (): State {
    return state
  }

  /**
   * Actions to be registered to Vuex Store.
   */
  static actions (): Vuex.ActionTree<any, any> {
    return actions(this)
  }

  /**
   * Mutations to be registered to Vuex Store.
   */
  static mutations (): Vuex.MutationTree<any> {
    return mutations(this)
  }

  /**
   * Get connection intance out of container.
   */
  static conn (): Connection {
    return Container.connection(this.connection)
  }

  /**
   * Save data to Vuex Store.
   */
  static saveToStore (rootState: any, data: Data.Data | Data.Data[]): object {
    const normalizedData = this.normalize(data)

    this.conn().save(rootState, normalizedData)

    return normalizedData
  }

  /**
   * Find given id from the Vuex Store.
   */
  static find (id: number): Model | null {
    return this.conn().find(this.entity, id)
  }

  /**
   * Heavy lift the creation of the new model instance.
   */
  initialize (fields: SchemaTypes.Fields): void {
    _.forEach(fields, (field: Attributes.Relationship, key: string) => {
      // If the field type is `attr`, set the good boy to the instance field.
      if (field.type === Attributes.ATTR) {
        this[key] = field.value

        return
      }

      // If the field type is `belongsTo`, we must do some serious work.
      if (field.type === Attributes.BELONGS_TO) {
        this.initializeBelongsTo(field, key)

        return
      }
    })
  }

  /**
   * Merge given data with this model's fields.
   */
  initializeFields (data: Data.Data = {}, full: boolean = true): SchemaTypes.Fields {
    let fields: SchemaTypes.Fields = this.fields()

    // If the attribute `full` is set to false, we'll remove fields that
    // isn't present in given data object.
    if (!full) {
      fields = _.pickBy(fields, (_attr, key: string) => _.has(data, key)) as SchemaTypes.Fields
    }

    // OK, next lets iterate over given data object and set appropriate
    // initial value or data to the corresponding fields.
    _.forEach(data, (value: any, key: string): void => {
      let relationship: Attributes.Relationship = fields[key]

      // If there is no matching field in model defined fields, then just
      // assume it's a regular attribute and assign as new field.
      if (!relationship) {
        relationship = this.self().attr(value)

        return
      }

      // If the matching filed type is `attr`, then set it as is.
      if (relationship.type === Attributes.ATTR) {
        relationship.value = value

        return
      }

      // If the matching filed type is `belongsTo`, save the data to
      // the data field.
      if (relationship.type === Attributes.BELONGS_TO) {
        relationship.data = value
      }
    })

    return fields
  }

  /**
   * Initialize belongsTo field.
   */
  initializeBelongsTo (field: Attributes.BelongsTo, key: string): void {
    // If the field data is `number`, it means the relation was normalized and
    // should have been, or will be saved at Vuex Store. So we'll make
    // reference to the corresponding entity.
    if (typeof field.data === 'number') {
      // Set the foreignKey to the instance field, since normalized data doesn't
      // contain them, is is suspected to be null.
      this[field.foreignKey] = field.data

      // Then we'll also create getter to access that relational entity.
      this.setBelongsToGetter(key, field.related, field.foreignKey)

      return
    }

    // If the field is not a number, that means it should be an object!
    // Let's instantiate related model and store it to the property.
    // But only if the object is not empty :)
    this[key] = new field.related(field.data)

    // Finally set foreignKey of this field based on the `otherKey`.
    this[field.foreignKey] = field.data && field.data[field.otherKey]
  }

  /**
   * Set belongsTo getter to this instance.
   */
  setBelongsToGetter (name: string, related: typeof Model, foreignKey: string): void {
    const that = this

    Object.defineProperty(this, name, {
      get () {
        return that.belongsTo(related, foreignKey)
      }
    })
  }

  /**
   * Get all static fields of this model.
   */
  fields (): SchemaTypes.Fields {
    return this.self().fields()
  }

  /**
   * Returns static primary key value of the model.
   */
  primaryKey (): number | string {
    return this[this.primaryKeyName()]
  }

  /**
   * Returns static primary key name of the model.
   */
  primaryKeyName (): string {
    return this.self().primaryKey
  }

  /**
   * Get entity that belongs to this model.
   */
  belongsTo (related: typeof Model, foreignKey: string): Model | null {
    return related.find(this[foreignKey])
  }

  /**
   * Creates the data to send to server.
   */
  data (): object {
    return _.mapValues(this.fields(), (_value: string, key: string | number) => (this as any)[key])
  }

  /**
   * Handy helper method to get static Model class it self.
   */
  self (): typeof Model {
    return (this.constructor as typeof Model)
  }
}
