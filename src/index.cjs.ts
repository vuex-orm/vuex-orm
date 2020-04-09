import './polyfills/Polyfills'

import { install } from './store/Store'
import { Database } from './database/Database'
import { Schema } from './schema/Schema'
import { Model } from './model/Model'
import { Attribute } from './model/attributes/Attribute'
import { Type } from './model/attributes/types/Type'
import { Attr as AttrAttr } from './model/attributes/types/Attr'
import { String as StringAttr } from './model/attributes/types/String'
import { Number as NumberAttr } from './model/attributes/types/Number'
import { Boolean as BooleanAttr } from './model/attributes/types/Boolean'
import { Relation } from './model/attributes/relations/Relation'
import { HasOne as HasOneAttr } from './model/attributes/relations/HasOne'
import { HasMany as HasManyAttr } from './model/attributes/relations/HasMany'
import { mutations } from './modules/Mutations'
import { Repository } from './repository/Repository'
import { Interpretation } from './interpretation/Interpretation'
import { Query } from './query/Query'
import { Connection } from './connection/Connection'

export default {
  install,
  Database,
  Schema,
  Model,
  Attribute,
  Type,
  AttrAttr,
  StringAttr,
  NumberAttr,
  BooleanAttr,
  Relation,
  HasOneAttr,
  HasManyAttr,
  mutations,
  Repository,
  Interpretation,
  Query,
  Connection
}
