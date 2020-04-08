import Type from './Type'

export default class Attr extends Type {
  /**
   * Make the value for the attribute.
   */
  make(value: any): any {
    return value
  }
}
