import Record from '../../data/Record'
import Model from '../../model/Model'
import Mutator from '../contracts/Mutator'
import Type from './Type'

export default class Attr extends Type {
  /**
   * Create a new attr instance.
   */
  constructor (model: typeof Model, value: any, mutator?: Mutator<any>) {
    super(model, value, mutator) /* istanbul ignore next */

    this.value = value
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  make (value: any, _parent: Record, key: string): any {
    value = value !== undefined ? value : this.value

    return this.mutate(value, key)
  }
}
