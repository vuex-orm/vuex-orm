import { Store, Plugin } from 'vuex'
import Container from '../container/Container'
import Database from '../database/Database'
import Model from '../model/Model'
import Repository from '../repository/Repository'

export type Install = (database: Database, options?: Options) => Plugin<any>

export interface Options {
  namespace?: string
}

/**
 * Install Vuex ORM database to the store.
 */
export default function install (database: Database, options: Options = {}): Plugin<any> {
  const namespace = options.namespace || 'entities'

  return (store) => { mixin(store, database, namespace) }
}

/**
 * Mixin Vuex ORM feature to the store.
 */
function mixin (store: Store<any>, database: Database, namespace: string): void {
  mixinRepoFunction(store)
  registerToContainer(store)
  startDatabase(store, database, namespace)
}

/**
 * Start the database.
 */
function startDatabase (store: Store<any>, database: Database, namespace: string): void {
  database.start(store, namespace)
}

/**
 * Register the store to the container.
 */
function registerToContainer (store: Store<any>): void {
  Container.register(store)
}

/**
 * Mixin repo function to the store.
 */
function mixinRepoFunction (store: Store<any>): void {
  store.$repo = function<M extends typeof Model>(model: M): Repository<M> {
    return new Repository(this, model)
  }
}
