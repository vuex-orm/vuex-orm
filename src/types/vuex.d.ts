import Database from '../database/Database'

declare module 'vuex' {
  interface Store<S> {
    /**
     * The database instance.
     */
    $database: Database
  }
}
