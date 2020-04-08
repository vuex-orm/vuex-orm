import { Constructor } from '../types'
import Database from '../database/Database'
import Model from '../model/Model'
import Repository from '../repository/Repository'

declare module 'vuex' {
  interface Store<S> {
    /**
     * The database instance.
     */
    $database: Database

    /**
     * Get a new repository instance for the given model.
     */
    $repo<M extends Model>(model: Constructor<M>): Repository<M>
  }
}
