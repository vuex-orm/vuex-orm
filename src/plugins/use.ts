import Model from '../model/Model'
import Attribute from '../attributes/Attribute'
import Type from '../attributes/types/Type'
import Attr from '../attributes/types/Attr'
import String from '../attributes/types/String'
import Number from '../attributes/types/Number'
import Boolean from '../attributes/types/Boolean'
import Uid from '../attributes/types/Uid'
import Relation from '../attributes/relations/Relation'
import HasOne from '../attributes/relations/HasOne'
import BelongsTo from '../attributes/relations/BelongsTo'
import HasMany from '../attributes/relations/HasMany'
import HasManyBy from '../attributes/relations/HasManyBy'
import BelongsToMany from '../attributes/relations/BelongsToMany'
import HasManyThrough from '../attributes/relations/HasManyThrough'
import MorphTo from '../attributes/relations/MorphTo'
import MorphOne from '../attributes/relations/MorphOne'
import MorphMany from '../attributes/relations/MorphMany'
import MorphToMany from '../attributes/relations/MorphToMany'
import MorphedByMany from '../attributes/relations/MorphedByMany'
import Getters from '../modules/Getters'
import Actions from '../modules/Actions'
import RootGetters from '../modules/RootGetters'
import RootActions from '../modules/RootActions'
import RootMutations from '../modules/RootMutations'
import GettersContract from '../modules/contracts/Getters'
import ActionsContract from '../modules/contracts/Actions'
import RootGettersContract from '../modules/contracts/RootGetters'
import RootActionsContract from '../modules/contracts/RootActions'
import RootMutationsContract from '../modules/contracts/RootMutations'
import Query from '../query/Query'
import Database from '../database/Database'

export interface PluginComponents {
  Model: typeof Model
  Attribute: typeof Attribute
  Type: typeof Type
  Attr: typeof Attr
  String: typeof String
  Number: typeof Number
  Boolean: typeof Boolean
  Uid: typeof Uid
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
  Query: typeof Query
  Database: typeof Database
}

export interface Options {
  [key: string]: any
}

export interface Plugin {
  [key: string]: any
}

export type Use = (plugin: Plugin, options?: Options) => void

export default function (plugin: Plugin, options: Options = {}): void {
  const components: PluginComponents = {
    Model,
    Attribute,
    Type,
    Attr,
    String,
    Number,
    Boolean,
    Uid,
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
    RootMutations,
    Query,
    Database
  }

  plugin.install(components, options)
}
