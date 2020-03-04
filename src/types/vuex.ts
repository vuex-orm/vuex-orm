import Database from '../database/Database'
import Model from '../model/Model'
import Repository from '../repository/Repository'

declare module 'vuex' {
  interface Store<S> {
    /**
     * The database instance registered to the store.
     */
    $db (): Database

    /**
     * Get a new repository instance for the given model.
     */
    $repo <M extends typeof Model> (model: M): Repository<M>
  }
}
