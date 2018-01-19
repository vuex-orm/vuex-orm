import install, { Install } from './store/install'
import use, { Use } from './plugins/use'
import Database from './Database'
import Model from './Model'
import Repo from './repo/Repo'
import Query from './repo/Query'

export interface VuexORM {
  install: Install
  use: Use
  Database: typeof Database
  Model: typeof Model
  Repo: typeof Repo
  Query: typeof Query
}

export default {
  install,
  use,
  Database,
  Model,
  Repo,
  Query
} as VuexORM
