import install, { Install } from './store/install'
import use, { Use } from './plugins/use'
import Database from './Database'
import Model from './Model'

export interface VuexORM {
  install: Install
  use: Use
  Database: typeof Database
  Model: typeof Model
}

export default {
  install,
  use,
  Database,
  Model
} as VuexORM

export {
  install,
  use,
  Database,
  Model
}
