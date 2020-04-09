import './polyfills/Polyfills'

export * from './data/Data'
export * from './store/Store'
export * from './database/Database'
export * from './schema/Schema'
export * from './model/Model'
export * from './model/decorators/attributes/types/Attr'
export * from './model/decorators/attributes/types/Str'
export * from './model/decorators/attributes/types/Num'
export * from './model/decorators/attributes/types/Bool'
export * from './model/decorators/attributes/relations/HasOne'
export * from './model/decorators/attributes/relations/HasMany'
export * from './model/decorators/Contracts'
export * from './model/attributes/Attribute'
export * from './model/attributes/types/Type'
export { Attr as AttrAttr } from './model/attributes/types/Attr'
export { String as StringAttr } from './model/attributes/types/String'
export { Number as NumberAttr } from './model/attributes/types/Number'
export { Boolean as BooleanAttr } from './model/attributes/types/Boolean'
export * from './model/attributes/relations/Relation'
export { HasOne as HasOneAttr } from './model/attributes/relations/HasOne'
export { HasMany as HasManyAttr } from './model/attributes/relations/HasMany'
export * from './modules/RootModule'
export * from './modules/RootState'
export * from './modules/Module'
export * from './modules/State'
export * from './modules/Mutations'
export * from './repository/Repository'
export * from './interpretation/Interpretation'
export * from './query/Query'
export * from './query/Options'
export * from './connection/Connection'

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
