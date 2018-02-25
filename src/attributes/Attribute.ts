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
   * Set given value to the value field. This method is used when
   * instantiating model to fill the attribute value.
   */
  abstract set (value: any): void

  /**
   * Return the appropriate value for the normalization. This method will
   * be called during the data normalization to fill field value.
   */
  abstract fill (value: any, parent: any): any

  /**
   * Make value to be set to model property. This method is used when
   * instantiating model to set its properties.
   */
  abstract make (value: any, parent: Record, key: string): any
}
