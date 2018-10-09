import Record from '../data/Record'
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
   * Convert given value to the appropriate value for the attribute.
   */
  abstract make (value: any, parent: Record, key: string): any
}
