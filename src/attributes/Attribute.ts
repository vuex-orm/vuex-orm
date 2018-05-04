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
   * Transform given data to the appropriate value. This method will be called
   * during data normalization to fix field that has an incorrect value,
   * or add a missing field with the appropriate default value.
   */
  abstract fill (value: any): any

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  abstract make (value: any, parent: Record, key: string, plain: boolean): any
}
