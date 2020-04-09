import { Model } from '../Model'

export abstract class Attribute {
  /**
   * The model instance.
   */
  protected model: Model

  /**
   * Create a new attribute instance.
   */
  constructor(model: Model) {
    this.model = model
  }

  /**
   * Make the value for the attribute.
   */
  abstract make(value?: any): any
}
