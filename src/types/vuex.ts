import Database from '../database/Database'

declare module 'vuex' {
  interface Store<S> {
    $db (): Database
  }
}
