import './support/polyfills'

import install, { Install } from './store/install'
import use, { Use } from './plugins/use'
import Database from './database/Database'
import Model from './model/Model'
import Query from './query/Query'
import Attribute from './attributes/Attribute'
import Type from './attributes/types/Type'
import Attr from './attributes/types/Attr'
import String from './attributes/types/String'
import Number from './attributes/types/Number'
import Boolean from './attributes/types/Boolean'
import Increment from './attributes/types/Increment'
import Relation from './attributes/relations/Relation'
import HasOne from './attributes/relations/HasOne'
import BelongsTo from './attributes/relations/BelongsTo'
import HasMany from './attributes/relations/HasMany'
import HasManyBy from './attributes/relations/HasManyBy'
import BelongsToMany from './attributes/relations/BelongsToMany'
import HasManyThrough from './attributes/relations/HasManyThrough'
import MorphTo from './attributes/relations/MorphTo'
import MorphOne from './attributes/relations/MorphOne'
import MorphMany from './attributes/relations/MorphMany'
import MorphToMany from './attributes/relations/MorphToMany'
import MorphedByMany from './attributes/relations/MorphedByMany'
import Getters from './modules/Getters'
import Actions from './modules/Actions'
import RootGetters from './modules/RootGetters'
import RootActions from './modules/RootActions'
import RootMutations from './modules/RootMutations'
import GettersContract from './modules/contracts/Getters'
import ActionsContract from './modules/contracts/Actions'
import RootGettersContract from './modules/contracts/RootGetters'
import RootActionsContract from './modules/contracts/RootActions'
import RootMutationsContract from './modules/contracts/RootMutations'

export interface VuexORM {
  install: Install
  use: Use
  Database: typeof Database
  Model: typeof Model
  Query: typeof Query
  Attribute: typeof Attribute
  Type: typeof Type
  Attr: typeof Attr
  String: typeof String
  Number: typeof Number
  Boolean: typeof Boolean
  Increment: typeof Increment
  Relation: typeof Relation
  HasOne: typeof HasOne
  BelongsTo: typeof BelongsTo
  HasMany: typeof HasMany
  HasManyBy: typeof HasManyBy
  BelongsToMany: typeof BelongsToMany
  HasManyThrough: typeof HasManyThrough
  MorphTo: typeof MorphTo
  MorphOne: typeof MorphOne
  MorphMany: typeof MorphMany
  MorphToMany: typeof MorphToMany
  MorphedByMany: typeof MorphedByMany
  Getters: GettersContract
  Actions: ActionsContract
  RootGetters: RootGettersContract
  RootActions: RootActionsContract
  RootMutations: RootMutationsContract
}

export {
  install,
  use,
  Database,
  Model,
  Query,
  Attribute,
  Type,
  Attr,
  String,
  Number,
  Boolean,
  Increment,
  Relation,
  HasOne,
  BelongsTo,
  HasMany,
  HasManyBy,
  BelongsToMany,
  HasManyThrough,
  MorphTo,
  MorphOne,
  MorphMany,
  MorphToMany,
  MorphedByMany,
  Getters,
  Actions,
  RootGetters,
  RootActions,
  RootMutations
}

export default {
  install,
  use,
  Database,
  Model,
  Query,
  Attribute,
  Type,
  Attr,
  String,
  Number,
  Boolean,
  Increment,
  Relation,
  HasOne,
  BelongsTo,
  HasMany,
  HasManyBy,
  BelongsToMany,
  HasManyThrough,
  MorphTo,
  MorphOne,
  MorphMany,
  MorphToMany,
  MorphedByMany,
  Getters,
  Actions,
  RootGetters,
  RootActions,
  RootMutations
} as VuexORM
