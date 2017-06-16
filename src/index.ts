import Vuex from 'vuex'
import Database from './Database'
import Config from './config/Config'

export interface Options {
  namespace?: string
}

export default (database: Database, options: Options = {}): Vuex.Plugin<any> => {
  const namespace: string = options.namespace || Config.defaultNamespace

  return (store: Vuex.Store<any>): void => {
    store.registerModule(namespace, database.module())

    database.connect(namespace, store)
  }
}
