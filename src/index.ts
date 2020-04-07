export * from './data/Data'

import { install, Options } from './store/Store'
import Database from './database/Database'
import Model from './model/Model'
import Attr from './model/decorators/types/Attr'
import Str from './model/decorators/types/Str'
import Num from './model/decorators/types/Num'
import Bool from './model/decorators/types/Bool'
import RootModule from './modules/RootModule'
import RootState from './modules/RootState'
import Module from './modules/Module'
import State from './modules/State'

export {
  install,
  Options,
  Database,
  Model,
  Attr,
  Str,
  Num,
  Bool,
  RootModule,
  RootState,
  Module,
  State
}

export default {
  install,
  Database,
  Model,
  Attr,
  Str,
  Num,
  Bool
}
