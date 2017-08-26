import Model from './Model'

export enum Type {
  Attr = 'Attr',
  HasOne = 'HasOne',
  BelongsTo = 'BelongsTo'
}

export interface Attr {
  type: Type.Attr
  value: any
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

export default class Attributes {
  /**
   * The generic attribute. The given value will be used as default value
   * of the property when instantiating a model.
   */
  static attr (value: any): Attr {
    return { type: Type.Attr, value }
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
}
