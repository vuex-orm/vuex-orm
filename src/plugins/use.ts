import Model from '../Model'
import Repo from '../repo/Repo'
import Query from '../repo/Query'
import rootGetters, { RootGetters } from '../modules/rootGetters'
import subGetters, { SubGetters } from '../modules/subGetters'
import rootActions, { RootActions } from '../modules/rootActions'
import subActions, { SubActions } from '../modules/subActions'
import mutations, { Mutations } from '../modules/mutations'

export interface Components {
  Model: typeof Model
  Repo: typeof Repo
  Query: typeof Query
  rootGetters: RootGetters
  subGetters: SubGetters
  rootActions: RootActions
  subActions: SubActions
  mutations: Mutations
}

export interface Options {
  [key: string]: any
}

export interface Plugin {
  install: (components: Components, options: Options) => void
  [key: string]: any
}

export type Use = (plugin: Plugin) => void

export default function (plugin: Plugin, options: Options = {}): void {
  const components: Components = {
    Model,
    Repo,
    Query,
    rootGetters,
    subGetters,
    rootActions,
    subActions,
    mutations
  }

  plugin.install(components, options)
}
