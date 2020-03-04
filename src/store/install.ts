import { Store, Plugin } from 'vuex'
import Container from '../container/Container'
import Database from '../database/Database'
import HackedDatabase from '../database/HackedDatabase'
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
  registerDatabase(store, database)
  mixinRepoFunction(store)
  mixinDbFunction(store)
  registerToContainer(store)
  startDatabase(store, namespace)
}

/**
 * Register the database to the store.
 */
function registerDatabase (store: Store<any>, database: Database): void {
  store.$database = database
}

/**
 * Mixin repo function to the store.
 */
function mixinRepoFunction (store: Store<any>): void {
  store.$repo = function<M extends typeof Model>(model: M): Repository<M> {
    return new Repository(this, model)
  }
}

/**
 * Mixin db function to the store.
 */
function mixinDbFunction (store: Store<any>): void {
  store.$db = function (): HackedDatabase {
    return new HackedDatabase(this.$database)
  }
}

/**
 * Register the store to the container.
 */
function registerToContainer (store: Store<any>): void {
  Container.register(store)
}

/**
 * Start the database.
 */
function startDatabase (store: Store<any>, namespace: string): void {
  store.$database.start(store, namespace)
}
