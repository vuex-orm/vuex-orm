import Model from '../Model'

export default abstract class Attribute<M extends typeof Model> {
  /**
   * The model instance.
   */
  protected model: M

  /**
   * Create a new attribute instance.
   */
  constructor(model: M) {
    this.model = model
  }

  /**
   * Make the value for the attribute.
   */
  abstract make(value: any): any
}
