import Model from './Model'

export enum Type {
  BelongsTo = 'BelongsTo'
}

export namespace Relationship {
  export interface BelongsTo {
    type: Type.BelongsTo,
    model: typeof Model,
    foreignKey: string
  }
}

export default class Relation {
  /**
   * The belongs to relationship.
   */
  static belongsTo (model: typeof Model, foreignKey: string): Relationship.BelongsTo {
    return { type: Type.BelongsTo, model, foreignKey }
  }
}
