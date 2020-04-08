import './polyfills/Polyfills'

export * from './data/Data'

import { install, Options } from './store/Store'
import Database from './database/Database'
import Schema from './schema/Schema'
import Model, { Fields } from './model/Model'
import * as Attributes from './model/attributes/Attributes'
import Attr from './model/decorators/attributes/types/Attr'
import Str from './model/decorators/attributes/types/Str'
import Num from './model/decorators/attributes/types/Num'
import Bool from './model/decorators/attributes/types/Bool'
import HasOne from './model/decorators/attributes/relations/HasOne'
import RootModule from './modules/RootModule'
import RootState from './modules/RootState'
import Module from './modules/Module'
import State from './modules/State'
import Mutations from './modules/Mutations'
import Repository from './repository/Repository'
import Interpretation from './interpretation/Interpretation'
import Query from './query/Query'
import * as QueryOptions from './query/options/Options'
import Connection from './connection/Connection'

export {
  install,
  Options,
  Database,
  Schema,
  Model,
  Fields,
  Attributes,
  Attr,
  Str,
  Num,
  Bool,
  HasOne,
  RootModule,
  RootState,
  Module,
  State,
  Mutations,
  Repository,
  Interpretation,
  Query,
  QueryOptions,
  Connection
}

export default {
  install,
  Database,
  Schema,
  Model,
  Attributes,
  Mutations,
  Repository,
  Interpretation,
  Query,
  QueryOptions,
  Connection
}
