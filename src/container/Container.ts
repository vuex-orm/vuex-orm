import { Store } from 'vuex'

export default class Container {
  /**
   * The store instance.
   */
  static store: Store<any>

  /**
   * Register the store instance.
   */
  static register(store: Store<any>): void {
    this.store = store
  }
}
