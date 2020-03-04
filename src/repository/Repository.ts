import { Store } from 'vuex'
import Model from '../model/Model'

export default class Repository<M extends typeof Model> {
  /**
   * The store instance for the repository.
   */
  store: Store<any>

  /**
   * The model for the repository.
   */
  model: M

  /**
   * Create a new repository instance.
   */
  constructor (store: Store<any>, model: M) {
    this.store = store
    this.model = model
  }
}
