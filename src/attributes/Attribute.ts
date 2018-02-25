import { Record } from '../data/Contract'
import Model from '../model/Model'

export default abstract class Attribute {
  /**
   * The model that this attributes is being registerd.
   */
  model: typeof Model

  /**
   * Create a new attribute instance.
   */
  constructor (model: typeof Model) {
    this.model = model
  }

  /**
   * Normalize the given value. This method is called during data normalization
   * to generate appropriate value to be saved to Vuex Store.
   */
  abstract normalize (value: any): any

  /**
   * Transform the given data to an appropriate value to be used for
   * model instantiation.
   */
  abstract fill (value: any): any

  /**
   * Make value to be set to model property. This method is used when
   * instantiating model to set its properties.
   */
  abstract make (value: any, parent: Record, key: string): any
}
