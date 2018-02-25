import './support/polyfills'

import install, { Install } from './store/install'
import use, { Use } from './plugins/use'
import Database from './database/Database'
import Model from './model/Model'
import Repo from './repo/Repo'
import Query from './repo/Query'
import rootGetters, { RootGetters } from './modules/rootGetters'
import subGetters, { SubGetters } from './modules/subGetters'
import rootActions, { RootActions } from './modules/rootActions'
import subActions, { SubActions } from './modules/subActions'
import mutations, { Mutations } from './modules/mutations'

export interface VuexORM {
  install: Install
  use: Use
  Database: typeof Database
  Model: typeof Model
  Repo: typeof Repo
  Query: typeof Query
  rootGetters: RootGetters
  subGetters: SubGetters
  rootActions: RootActions
  subActions: SubActions
  mutations: Mutations
}

export default {
  install,
  use,
  Database,
  Model,
  Repo,
  Query,
  rootGetters,
  subGetters,
  rootActions,
  subActions,
  mutations
} as VuexORM

export {
  install,
  use,
  Database,
  Model,
  Repo,
  Query,
  rootGetters,
  subGetters,
  rootActions,
  subActions,
  mutations
}
