import Record from '../../data/Record'
import Model from '../../model/Model'
import Type from './Type'

export default class Attr extends Type {
  /**
   * The default value of the field.
   */
  value: any

  /**
   * Create a new attr instance.
   */
  constructor (model: typeof Model, value: any, mutator?: (value: any) => any) {
    super(model, mutator) /* istanbul ignore next */

    this.value = value
  }

  /**
   * Transform given data to the appropriate value. This method will be called
   * during data normalization to fix field that has an incorrect value,
   * or add a missing field with the appropriate default value.
   */
  fill (value: any): any {
    return value !== undefined ? value : this.value
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  make (value: any, _parent: Record, key: string, _plain?: boolean): any {
    return this.mutate(this.fill(value), key)
  }
}
