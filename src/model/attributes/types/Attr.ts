import Model from '../../Model'
import Type from './Type'

export default class Attr<M extends typeof Model> extends Type<M> {
  /**
   * Make the value for the attribute.
   */
  make(value: any): any {
    return value
  }
}
