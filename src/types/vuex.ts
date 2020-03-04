import Database from '../database/Database'
import HackedDatabase from '../database/HackedDatabase'
import Model from '../model/Model'
import Repository from '../repository/Repository'

declare module 'vuex' {
  interface Store<S> {
    /**
     * The database instance registered to the store.
     */
    $database: Database

    /**
     * Get a new repository instance for the given model.
     */
    $repo <M extends typeof Model> (model: M): Repository<M>

    /**
     * Get the database attached to the store. It's the old syntax and should
     * avoid using it.
     *
     * It will return a "Hacked" database that capable of finding a copied
     * model object. It's an old way of interacting with the database.
     *
     * TODO: Update the version.
     * @deprecated Since v0.XX.X
     */
    $db (): HackedDatabase
  }
}
