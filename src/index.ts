import Vuex from 'vuex'
import Database from './Database'

export interface Options {
  namespace?: string
}

export default (database: Database, options: Options = {}): Vuex.Plugin<any> => {
  const namespace: string = options.namespace || 'entities'

  return (store: Vuex.Store<any>): void => {
    store.registerModule(namespace, database.modules())
  }
}
