import './polyfills/Polyfills'

import { install } from './store/Store'
import Database from './database/Database'
import Schema from './schema/Schema'
import Model from './model/Model'
import * as Attributes from './model/attributes/Attributes'
import Mutations from './modules/Mutations'
import Repository from './repository/Repository'
import Interpretation from './interpretation/Interpretation'
import Query from './query/Query'
import * as QueryOptions from './query/options/Options'
import Connection from './connection/Connection'

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
