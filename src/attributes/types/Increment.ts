import { Fields } from '../contracts/Contract'
import Type from './Type'

export default class Increment extends Type {
  /**
   * The initial count to start incrementing.
   */
  value: number = 1

  /**
   * Set given value to the value field. This method is used when
   * instantiating model to fill the attribute value.
   */
  set (value: any): void {
    this.value = value
  }

  /**
   * Return null if the value is not present. Auto incrementation should
   * be done after the normalization completed.
   */
  fill (value: any): any {
    return value || null
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating model to set its properties.
   */
  make (_parent: Fields, _key: string): number {
    return this.value
  }
}
