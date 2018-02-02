import Model from '../Model'
import Types from './Types'
import Relations from './Relations'
import Attr from './types/Attr'
import Increment from './types/Increment'
import HasOne from './relations/HasOne'
import BelongsTo from './relations/BelongsTo'
import HasMany from './relations/HasMany'
import HasManyBy from './relations/HasManyBy'

export type Entity = typeof Model | string

export type Attributes = Types | Relations

export type Field = Fields | Attributes

export interface Fields {
  [key: string]: Field
}

export default class Attribute {
  /**
   * The generic attribute. The given value will be used as default value
   * of the property when instantiating a model.
   */
  static attr (value: any, mutator?: (value: any) => any): Attr {
    return new Attr(value, mutator)
  }

  /**
   * The auto-increment attribute. The field with this attribute will
   * automatically increment its value creating a new record.
   */
  static increment (): Increment {
    return new Increment()
  }

  /**
   * The has one relationship.
   */
  static hasOne (related: Entity, foreignKey: string, localKey: string, connection?: string): HasOne {
    return new HasOne(related, foreignKey, localKey, null, connection)
  }

  /**
   * The belongs to relationship.
   */
  static belongsTo (parent: Entity, foreignKey: string, ownerKey: string, connection?: string): BelongsTo {
    return new BelongsTo(parent, foreignKey, ownerKey, null, connection)
  }

  /**
   * The has many relationship.
   */
  static hasMany (related: Entity, foreignKey: string, localKey: string, connection?: string): HasMany {
    return new HasMany(related, foreignKey, localKey, [], connection)
  }

  /**
   * The has many by relationship.
   */
  static hasManyBy (parent: Entity, foreignKey: string, ownerKey: string, connection?: string): HasManyBy {
    return new HasManyBy(parent, foreignKey, ownerKey, [], connection)
  }

  /**
   * Determine if the given value is the type of fields.
   */
  static isFields (attr: Field): attr is Fields {
    return !this.isAttribute(attr)
  }

  /**
   * Determine if the given value is the type of field.
   */
  static isAttribute (attr: Field): attr is Attributes {
    return attr instanceof Attr
           || attr instanceof Increment
           || this.isRelation(attr)
  }

  static isRelation (attr: Field): attr is Relations {
    return attr instanceof HasOne
           || attr instanceof BelongsTo
           || attr instanceof HasMany
           || attr instanceof HasManyBy
  }
}
