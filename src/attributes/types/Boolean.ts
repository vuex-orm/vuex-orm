import Record from '../../data/Record'
import Model from '../../model/Model'
import Mutator from '../contracts/Mutator'
import Type from './Type'

export default class Boolean extends Type {
  /**
   * Hardcoded type for introspection
   */
  readonly className: string = 'Boolean'

  /**
   * Create a new number instance.
   */
  constructor(
    model: typeof Model,
    value: boolean,
    mutator?: Mutator<boolean | null>
  ) {
    /* istanbul ignore next */
    super(model, value, mutator)
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make(value: any, _parent: Record, key: string): boolean | null {
    return this.mutate(this.fix(value), key)
  }

  /**
   * Transform given data to the boolean.
   */
  fix(value: any): boolean | null {
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

    if (value === null && this.isNullable) {
      return value
    }

    return false
  }
}
