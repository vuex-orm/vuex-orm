export * from './data/Data'

import { install, Options } from './store/Store'
import Database from './database/Database'
import Model from './model/Model'
import RootModule from './modules/RootModule'
import RootState from './modules/RootState'
import Module from './modules/Module'
import State from './modules/State'

export {
  install,
  Options,
  Database,
  Model,
  RootModule,
  RootState,
  Module,
  State
}

export default {
  install,
  Database,
  Model
}
