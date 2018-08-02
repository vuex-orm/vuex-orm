import * as Vuex from 'vuex'
import Container from '../connections/Container'
import Database from '../database/Database'
import Entity from '../database/Entity'
import ModuleOptions, { Options } from '../options/Options'

export type Install = (database: Database, options?: Options) => Vuex.Plugin<any>

export default (database: Database, options: Options): Vuex.Plugin<any> => {

  return (store: Vuex.Store<any>): void => {

    ModuleOptions.register(options)

    store.registerModule(ModuleOptions.namespace, database.createModule(ModuleOptions.namespace))

    database.registerStore(store)

    database.registerNamespace(ModuleOptions.namespace)

    Container.register(ModuleOptions.namespace, database)

    database.entities.forEach((entity: Entity) => {
      entity.model.conf()
    })
  }
}
