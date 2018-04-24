import Model from '../model/Model'
import Query from '../query/Query'
import Attribute from '../attributes/Attribute'
import Type from '../attributes/types/Type'
import Attr from '../attributes/types/Attr'
import String from '../attributes/types/String'
import Number from '../attributes/types/Number'
import Boolean from '../attributes/types/Boolean'
import Increment from '../attributes/types/Increment'
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
import rootGetters, { RootGetters } from '../modules/rootGetters'
import subGetters, { SubGetters } from '../modules/subGetters'
import rootActions, { RootActions } from '../modules/rootActions'
import subActions, { SubActions } from '../modules/subActions'
import mutations, { Mutations } from '../modules/mutations'

export interface Components {
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
  rootGetters: RootGetters
  subGetters: SubGetters
  rootActions: RootActions
  subActions: SubActions
  mutations: Mutations
}

export interface Options {
  [key: string]: any
}

export interface Plugin {
  install: (components: Components, options: Options) => void
  [key: string]: any
}

export type Use = (plugin: Plugin) => void

export default function (plugin: Plugin, options: Options = {}): void {
  const components: Components = {
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
    rootGetters,
    subGetters,
    rootActions,
    subActions,
    mutations
  }

  plugin.install(components, options)
}
