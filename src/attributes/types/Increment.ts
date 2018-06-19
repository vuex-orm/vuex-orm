import Record from '../../data/Record'
import Model from '../../model/Model'
import Type from './Type'

export default class Increment extends Type {
  /**
   * The initial count to start incrementing.
   */
  value: number = 1

  /**
   * Create a new increment instance.
   */
  constructor (model: typeof Model) {
    super(model) /* istanbul ignore next */
  }

  /**
   * Transform given data to the appropriate value. This method will be called
   * during data normalization to fix field that has an incorrect value,
   * or add a missing field with the appropriate default value.
   */
  fill (value: any): number {
    return value
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  make (value: any, _parent: Record, _key: string, _plain?: boolean): number | null {
    return typeof value === 'number' ? value : null
  }
}
