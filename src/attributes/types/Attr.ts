import Record from '../../data/Record'
import Model from '../../model/Model'
import Mutator from '../contracts/Mutator'
import Type from './Type'

export default class Attr extends Type {
  /**
   * Create a new attr instance.
   */
  constructor(model: typeof Model, value: any, mutator?: Mutator<any>) {
    /* istanbul ignore next */
    super(model, value, mutator)
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  make(value: any, _parent: Record, key: string): any {
    value = value !== undefined ? value : this.value

    // Default Value might be a function (taking no parameter).
    let localValue = value

    if (typeof value === 'function') {
      localValue = value()
    }

    return this.mutate(localValue, key)
  }
}
