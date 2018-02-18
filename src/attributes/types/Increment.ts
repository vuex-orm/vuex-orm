import Type from './Type'

export default class Increment extends Type {
  /**
   * The initial count to start incrementing.
   */
  value: number = 1

  /**
   * Return null if the value is not present. Auto incrementation should
   * be done after the normalization completed.
   */
  fill (value: any): any {
    return value || null
  }
}
