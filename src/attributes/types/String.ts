import Record from '../../data/Record'
import BaseModel from '../../model/BaseModel'
import Type from './Type'

export default class String extends Type {
  /**
   * The default value of the field.
   */
  value: string

  /**
   * Create a new string instance.
   */
  constructor (model: typeof BaseModel, value: string, mutator?: (value: any) => any) {
    super(model, mutator) /* istanbul ignore next */

    this.value = value
  }

  /**
   * Transform given data to the appropriate value. This method will be called
   * during data normalization to fix field that has an incorrect value,
   * or add a missing field with the appropriate default value.
   */
  fill (value: any): string {
    if (value === undefined) {
      return this.value
    }

    if (typeof value === 'string') {
      return value
    }

    return value + ''
  }

  /**
   * Make value to be set to BaseModel property. This method is used when
   * instantiating a BaseModel or creating a plain object from a BaseModel.
   */
  make (value: any, _parent: Record, key: string): any {
    return this.mutate(this.fill(value), key)
  }
}
