import Model from '../Model'
import Types from './Types'
import Relations from './Relations'
import Attr from './types/Attr'
import Increment from './types/Increment'
import HasOne from './relations/HasOne'
import BelongsTo from './relations/BelongsTo'
import HasMany from './relations/HasMany'
import HasManyBy from './relations/HasManyBy'
import BelongsToMany from './relations/BelongsToMany'
import MorphTo from './relations/MorphTo'
import MorphOne from './relations/MorphOne'
import MorphMany from './relations/MorphMany'

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
   * The has belongs to many relationship.
   */
  static belongsToMany (
    related: Entity,
    pivot: Entity,
    foreignPivotKey: string,
    relatedPivotKey: string,
    parentKey: string,
    relatedKey: string,
    connection?: string
  ): BelongsToMany {
    return new BelongsToMany(
      related,
      pivot,
      foreignPivotKey,
      relatedPivotKey,
      parentKey,
      relatedKey,
      [],
      connection
    )
  }

  /**
   * The morph to relationship.
   */
  static morphTo (id: string, type: string, connection?: string): MorphTo {
    return new MorphTo(id, type, null, connection)
  }

  /**
   * The morph one relationship.
   */
  static morphOne (related: Entity, id: string, type: string, localKey: string, connection?: string): MorphOne {
    return new MorphOne(related, id, type, localKey, null, connection)
  }

  /**
   * The morph many relationship.
   */
  static morphMany (related: Entity, id: string, type: string, localKey: string, connection?: string): MorphMany {
    return new MorphMany(related, id, type, localKey, [], connection)
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

  /**
   * Determine if the given value is the type of relations.
   */
  static isRelation (attr: Field): attr is Relations {
    return attr instanceof HasOne
           || attr instanceof BelongsTo
           || attr instanceof HasMany
           || attr instanceof HasManyBy
           || attr instanceof BelongsToMany
           || attr instanceof MorphTo
           || attr instanceof MorphOne
           || attr instanceof MorphMany
  }

  /**
   * Determine if the given value is the type of morph relations.
   */
  static isMorphRelation (attr: Relations): attr is MorphOne | MorphMany {
    return attr instanceof MorphOne || attr instanceof MorphMany
  }
}
