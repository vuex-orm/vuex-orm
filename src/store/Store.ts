import { Store, Plugin } from 'vuex'
import Database from '../database/Database'
import Model from '../model/Model'
import Constructor from '../model/Constructor'
import Repository from '../repository/Repository'

export interface Options {
  namespace?: string
}

type FilledOptions = Required<Options>

/**
 * Install Vuex ORM to the store.
 */
export function install(database: Database, options?: Options): Plugin<any> {
  return (store) => {
    mixin(store, database, createOptions(options))
  }
}

/**
 * Create options by merging the given user-provided options.
 */
function createOptions(options: Options = {}): FilledOptions {
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
  options: FilledOptions
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
  options: FilledOptions
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
  store.$repo = function<M extends Model>(
    model: Constructor<M>
  ): Repository<M> {
    return new Repository(this, model)
  }
}
