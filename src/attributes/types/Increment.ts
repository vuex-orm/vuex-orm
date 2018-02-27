import { Record } from '../../data/Contract'
import Type from './Type'

export default class Increment extends Type {
  /**
   * The initial count to start incrementing.
   */
  value: number = 1

  /**
   * Transform given data to the appropriate value. This method will be called
   * during data normalization to fix field that has an incorrect value,
   * or add a missing field with the appropriate default value.
   */
  fill (value: any): number | null {
    return typeof value === 'number' ? value : null
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating model to set its properties.
   */
  make (value: any, _parent: Record, _key: string): number {
    return value
  }
}
