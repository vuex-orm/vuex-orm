import Record from '../../data/Record'
import Model from '../../model/Model'
import Type from './Type'

export default class Boolean extends Type {
  /**
   * The default value of the field.
   */
  value: boolean

  /**
   * Create a new number instance.
   */
  constructor (model: typeof Model, value: boolean, mutator?: (value: any) => any) {
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
   * Transform given data to the boolean.
   */
  fix (value: any): boolean {
    if (value === undefined) {
      return this.value
    }

    if (typeof value === 'boolean') {
      return value
    }

    if (typeof value === 'string') {
      if (value.length === 0) {
        return false
      }

      const int = parseInt(value, 0)

      return isNaN(int) ? true : !!int
    }

    if (typeof value === 'number') {
      return !!value
    }

    return false
  }
}
