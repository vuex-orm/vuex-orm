import './support/polyfills'

import install, { Install } from './store/install'
import use, { Use } from './plugins/use'
import Database from './database/Database'
import Model from './model/Model'
import Repo from './repo/Repo'
import Query from './repo/Query'
import Type from './attributes/types/Type'
import Attr from './attributes/types/Attr'
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
import rootGetters, { RootGetters } from './modules/rootGetters'
import subGetters, { SubGetters } from './modules/subGetters'
import rootActions, { RootActions } from './modules/rootActions'
import subActions, { SubActions } from './modules/subActions'
import mutations, { Mutations } from './modules/mutations'

export interface VuexORM {
  install: Install
  use: Use
  Database: typeof Database
  Model: typeof Model
  Repo: typeof Repo
  Query: typeof Query
  Type: typeof Type
  Attr: typeof Attr
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
  rootGetters: RootGetters
  subGetters: SubGetters
  rootActions: RootActions
  subActions: SubActions
  mutations: Mutations
}

export default {
  install,
  use,
  Database,
  Model,
  Repo,
  Query,
  Type,
  Attr,
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
  rootGetters,
  subGetters,
  rootActions,
  subActions,
  mutations
} as VuexORM
