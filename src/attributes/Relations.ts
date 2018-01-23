import Types from './AttrTypes'
import Model from '../Model'

export type Entity = typeof Model | string

export type Relation = HasOne | BelongsTo | HasMany | HasManyBy

export interface HasOne {
  type: Types.HasOne
  model: Entity
  foreignKey: string
  value: any
}

export interface BelongsTo {
  type: Types.BelongsTo
  model: Entity
  foreignKey: string
  value: any
}

export interface HasMany {
  type: Types.HasMany
  model: Entity
  foreignKey: string
  value: any
}

export interface HasManyBy {
  type: Types.HasManyBy
  model: Entity
  foreignKey: string
  otherKey: string
  value: any
}
