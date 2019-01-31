import Record from '../../data/Record'
import Model from '../../model/Model'
import Mutator from '../contracts/Mutator'
import Type from './Type'

export default class String extends Type {
  /**
   * Create a new string instance.
   */
  constructor (model: typeof Model, value: string | null, mutator?: Mutator<string | null>) {
    super(model, value, mutator) /* istanbul ignore next */
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make (value: any, _parent: Record, key: string): string | null {
    return this.mutate(this.fix(value), key)
  }

  /**
   * Convert given value to the string.
   */
  fix (value: any): string | null {
    if (value === undefined) {
      return this.value
    }

    if (typeof value === 'string') {
      return value
    }

    if (value === null && this.isNullable) {
      return value
    }

    return value + ''
  }
}
