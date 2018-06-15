import * as Vuex from 'vuex'
import Container from '../connections/Container'
import Database from '../database/Database'

export type Install = (database: Database, options?: Options) => Vuex.Plugin<any>

export interface Options {
  namespace?: string
}

export default (database: Database, options: Options = {}): Vuex.Plugin<any> => {
  const namespace = options.namespace || 'entities'

  return (store: Vuex.Store<any>): void => {
    store.registerModule(namespace, database.createModule(namespace))

    database.registerStore(store)

    database.registerNamespace(namespace)

    Container.register(namespace, database)
  }
}
