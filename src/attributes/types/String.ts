import Record from '../../data/Record'
import Model from '../../model/Model'
import Type from './Type'

export default class String extends Type {
  /**
   * The default value of the field.
   */
  value: string

  /**
   * Create a new string instance.
   */
  constructor (model: typeof Model, value: string, mutator?: (value: any) => any) {
    super(model, mutator) /* istanbul ignore next */

    this.value = value
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make (value: any, _parent: Record, key: string): any {
    return this.mutate(this.fix(value), key)
  }

  /**
   * Convert given value to the string.
   */
  fix (value: any): string {
    if (value === undefined) {
      return this.value
    }

    if (typeof value === 'string') {
      return value
    }

    return value + ''
  }
}
