import { Record } from '../../data/Contract'
import Type from './Type'

export default class Increment extends Type {
  /**
   * The initial count to start incrementing.
   */
  value: number = 1

  /**
   * Normalize the given value. This method is called during data normalization
   * to generate appropriate value to be saved to Vuex Store.
   */
  normalize (value: any): any {
    return this.fill(value)
  }

  /**
   * Return null if the value is not present. Auto incrementation should
   * be done after the normalization completed.
   */
  fill (value: any): any {
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
