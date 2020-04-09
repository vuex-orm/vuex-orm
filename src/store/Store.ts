import { Constructor } from '../types'
import { Store, Plugin } from 'vuex'
import { Database } from '../database/Database'
import { Model } from '../model/Model'
import { Repository } from '../repository/Repository'

export interface InstallOptions {
  namespace?: string
}

type FilledInstallOptions = Required<InstallOptions>

/**
 * Install Vuex ORM to the store.
 */
export function install(
  database: Database,
  options?: InstallOptions
): Plugin<any> {
  return (store) => {
    mixin(store, database, createOptions(options))
  }
}

/**
 * Create options by merging the given user-provided options.
 */
function createOptions(options: InstallOptions = {}): FilledInstallOptions {
  return {
    namespace: options.namespace ?? 'entities'
  }
}

/**
 * Mixin Vuex ORM feature to the store.
 */
function mixin(
  store: Store<any>,
  database: Database,
  options: FilledInstallOptions
): void {
  connectDatabase(store, database, options)

  mixinRepoFunction(store)

  startDatabase(store)
}

/**
 * Connect the database to the store.
 */
function connectDatabase(
  store: Store<any>,
  database: Database,
  options: FilledInstallOptions
): void {
  database.setStore(store).setConnection(options.namespace)

  store.$database = database
}

/**
 * Start the database.
 */
function startDatabase(store: Store<any>): void {
  store.$database.start()
}

/**
 * Mixin repo function to the store.
 */
function mixinRepoFunction(store: Store<any>): void {
  store.$repo = function <M extends Model>(
    model: Constructor<M>
  ): Repository<M> {
    return new Repository(this, model)
  }
}
