import Database from '../database/Database'

declare module 'vuex/types' {
  interface Store<S> {
    $db (): Database
  }
}
