import Record from '../../data/Record'
import Model from '../../model/Model'
import Type from './Type'

export default class Number extends Type {
  /**
   * The default value of the field.
   */
  value: number

  /**
   * Create a new number instance.
   */
  constructor (model: typeof Model, value: number, mutator?: (value: any) => any) {
    super(model, mutator) /* istanbul ignore next */

    this.value = value
  }

  /**
   * Transform given data to the appropriate value. This method will be called
   * during data normalization to fix field that has an incorrect value,
   * or add a missing field with the appropriate default value.
   */
  fill (value: any): number {
    if (value === undefined) {
      return this.value
    }

    if (typeof value === 'number') {
      return value
    }

    if (typeof value === 'string') {
      return parseFloat(value)
    }

    if (typeof value === 'boolean') {
      return value ? 1 : 0
    }

    return 0
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  make (value: any, _parent: Record, key: string, _plain?: boolean): any {
    return this.mutate(this.fill(value), key)
  }
}
