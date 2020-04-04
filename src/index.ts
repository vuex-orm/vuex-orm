import './types/vuex'
import './polyfills'

import { install } from './store'
import { use, PluginComponents } from './plugins/use'
import Container from './container/Container'
import Database from './database/Database'
import Model from './model/Model'
import Fields from './model/contracts/Fields'
import Attribute from './attributes/Attribute'
import Type from './attributes/types/Type'
import Attr from './attributes/types/Attr'
import String from './attributes/types/String'
import Number from './attributes/types/Number'
import Boolean from './attributes/types/Boolean'
import Uid from './attributes/types/Uid'
import Relation from './attributes/relations/Relation'
import HasOne from './attributes/relations/HasOne'
import BelongsTo from './attributes/relations/BelongsTo'
import HasMany from './attributes/relations/HasMany'
import HasManyBy from './attributes/relations/HasManyBy'
import BelongsToMany from './attributes/relations/BelongsToMany'
import HasOneThrough from './attributes/relations/HasOneThrough'
import HasManyThrough from './attributes/relations/HasManyThrough'
import MorphTo from './attributes/relations/MorphTo'
import MorphOne from './attributes/relations/MorphOne'
import MorphMany from './attributes/relations/MorphMany'
import MorphToMany from './attributes/relations/MorphToMany'
import MorphedByMany from './attributes/relations/MorphedByMany'
import Repository from './repository/Repository'
import Getters from './modules/Getters'
import Actions from './modules/Actions'
import RootGetters from './modules/RootGetters'
import RootActions from './modules/RootActions'
import RootMutations from './modules/RootMutations'
import Query from './query/Query'
import Record from './data/Record'
import Records from './data/Records'
import NormalizedData from './data/NormalizedData'
import Instance from './data/Instance'
import Instances from './data/Instances'
import InstanceOf from './data/InstanceOf'
import Entities from './data/Entities'
import Item from './data/Item'
import Collection from './data/Collection'
import Collections from './data/Collections'

export {
  install,
  use,
  PluginComponents,
  Container,
  Database,
  Model,
  Fields,
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
  HasOneThrough,
  HasManyThrough,
  MorphTo,
  MorphOne,
  MorphMany,
  MorphToMany,
  MorphedByMany,
  Repository,
  Getters,
  Actions,
  RootGetters,
  RootActions,
  RootMutations,
  Query,
  Record,
  Records,
  NormalizedData,
  Instance,
  Instances,
  InstanceOf,
  Entities,
  Item,
  Collection,
  Collections
}

export default {
  install,
  use,
  Container,
  Database,
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
  HasOneThrough,
  HasManyThrough,
  MorphTo,
  MorphOne,
  MorphMany,
  MorphToMany,
  MorphedByMany,
  Repository,
  Getters,
  Actions,
  RootGetters,
  RootActions,
  RootMutations,
  Query
}
