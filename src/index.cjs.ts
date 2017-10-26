import install, { Install } from './store/install'
import Database from './Database'
import Model from './Model'

export interface VuexORM {
  install: Install
  Database: typeof Database
  Model: typeof Model
}

export default {
  install,
  Database,
  Model
} as VuexORM
