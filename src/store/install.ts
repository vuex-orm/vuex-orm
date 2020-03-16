import { Store, Plugin } from 'vuex'
import Container from '../container/Container'
import Database from '../database/Database'
import HackedDatabase from '../database/HackedDatabase'
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
  store.$repo = function (modelOrRepository: any): any {
    const repository = modelOrRepository._isRepository
      ? new modelOrRepository(this)
      : new Repository(this, modelOrRepository)

    if (!repository.model) {
      throw new Error(
        '[Vuex ORM] The repository was instantiated without a model being ' +
        'set. It happens when you forgot to register the model to the ' +
        'custom repository. Please check if you have correctly set `model` ' +
        'property at the repository class.'
      )
    }

    return repository
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
