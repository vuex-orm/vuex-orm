import Data from '../data/Data'
import Model from '../Model'

export const ATTR = 'ATTR'
export const BELONGS_TO = 'BELONGS_TO'

export interface Attr {
  type: 'ATTR'
  value: any
}

export interface BelongsTo {
  type: 'BELONGS_TO'
  related: typeof Model
  foreignKey: string
  otherKey: string
  data: Data.Data | number
}

export type Relationship = Attr | BelongsTo

export type AttrGenerator = (value: any) => Attr
export type BelongsToGenerator = (related: typeof Model, foreignKey: string, otherKey?: string) => BelongsTo

/**
 * Create normal attribute field.
 */
export function attr (value: any): Attr {
  return { type: ATTR, value }
}

/**
 * Create belongsTo relationship field.
 */
export function belongsTo (related: typeof Model, foreignKey: string, otherKey: string = 'id'): BelongsTo {
  return { type: BELONGS_TO, related, foreignKey, otherKey, data: {} }
}
