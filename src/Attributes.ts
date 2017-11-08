import Model from './Model'

export enum Type {
  Attr = 'Attr',
  HasOne = 'HasOne',
  BelongsTo = 'BelongsTo',
  HasMany = 'HasMany',
  HasManyBy = 'HasManyBy'
}

export type Relations = Attrs | Attr | HasOne | BelongsTo | HasMany | HasManyBy

export type Relation = Attr | HasOne | BelongsTo | HasMany | HasManyBy

export interface Attrs {
  [key: string]: Relations
}

export interface Attr {
  type: Type.Attr
  value: any
  mutator?: Function
}

export interface HasOne {
  type: Type.HasOne
  model: typeof Model | string
  foreignKey: string
  value: any
}

export interface BelongsTo {
  type: Type.BelongsTo
  model: typeof Model | string
  foreignKey: string
  value: any
}

export interface HasMany {
  type: Type.HasMany
  model: typeof Model | string
  foreignKey: string
  value: any
}

export interface HasManyBy {
  type: Type.HasManyBy
  model: typeof Model | string
  foreignKey: string
  otherKey: string
  value: any
}

export default class Attributes {
  /**
   * The generic attribute. The given value will be used as default value
   * of the property when instantiating a model.
   */
  static attr (value: any, mutator?: Function): Attr {
    return { type: Type.Attr, value, mutator }
  }

  /**
   * The has one relationship.
   */
  static hasOne (model: typeof Model | string, foreignKey: string): HasOne {
    return { type: Type.HasOne, model, foreignKey, value: null }
  }

  /**
   * The belongs to relationship.
   */
  static belongsTo (model: typeof Model | string, foreignKey: string): BelongsTo {
    return { type: Type.BelongsTo, model, foreignKey, value: null }
  }

  /**
   * The has many relationship.
   */
  static hasMany (model: typeof Model | string, foreignKey: string): HasMany {
    return { type: Type.HasMany, model, foreignKey, value: null }
  }

  /**
   * The has many by relationship.
   */
  static hasManyBy (model: typeof Model | string, foreignKey: string, otherKey: string = 'id'): HasManyBy {
    return { type: Type.HasManyBy, model, foreignKey, otherKey, value: null }
  }

  /**
   * Determine if given attr is relation.
   */
  static isRelation (attr: Relations): attr is Relation {
    if (this.isAttrs(attr)) {
      return false
    }

    return attr.type === Type.Attr
           || attr.type === Type.HasOne
           || attr.type === Type.BelongsTo
           || attr.type === Type.HasMany
           || attr.type === Type.HasManyBy
  }

  /**
   * Determine if given attr is Attrs.
   */
  static isAttrs (attr: Relations): attr is Attrs {
    return (attr as any).type === undefined
  }
}
