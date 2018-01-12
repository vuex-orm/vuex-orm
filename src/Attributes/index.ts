import Model from '../Model'
import AttrTypes from './AttrTypes'
import * as Types from './Types'
import * as Relations from './Relations'

export type Entity = typeof Model | string

export type Field = Fields | Types.Type | Relations.Relation

export type Attribute = Types.Type | Relations.Relation

export interface Fields {
  [key: string]: Field
}

export default class Attributes {
  /**
   * The generic attribute. The given value will be used as default value
   * of the property when instantiating a model.
   */
  static attr (value: any, mutator?: (value: any) => any): Types.Attr {
    return { type: AttrTypes.Attr, value, mutator }
  }

  /**
   * The has one relationship.
   */
  static hasOne (model: Entity, foreignKey: string): Relations.HasOne {
    return { type: AttrTypes.HasOne, model, foreignKey, value: null }
  }

  /**
   * The belongs to relationship.
   */
  static belongsTo (model: Entity, foreignKey: string): Relations.BelongsTo {
    return { type: AttrTypes.BelongsTo, model, foreignKey, value: null }
  }

  /**
   * The has many relationship.
   */
  static hasMany (model: Entity, foreignKey: string): Relations.HasMany {
    return { type: AttrTypes.HasMany, model, foreignKey, value: null }
  }

  /**
   * The has many by relationship.
   */
  static hasManyBy (model: Entity, foreignKey: string, otherKey: string = 'id'): Relations.HasManyBy {
    return { type: AttrTypes.HasManyBy, model, foreignKey, otherKey, value: null }
  }

  /**
   * Determine if the given value is the type of field.
   */
  static isAttribute (attr: Field): attr is Attribute {
    if (this.isFields(attr)) {
      return false
    }

    return attr.type === AttrTypes.Attr
           || attr.type === AttrTypes.HasOne
           || attr.type === AttrTypes.BelongsTo
           || attr.type === AttrTypes.HasMany
           || attr.type === AttrTypes.HasManyBy
  }

  /**
   * Determine if the given value is the type of fields.
   */
  static isFields (attr: Field): attr is Fields {
    return (attr as any).type === undefined
  }
}
