import Record from '../../data/Record'
import Model from '../../model/Model'
import Mutator from '../contracts/Mutator'
import Type from './Type'

export default class Number extends Type {
  /**
   * Create a new number instance.
   */
  constructor(
    model: typeof Model,
    value: number | null,
    mutator?: Mutator<number | null>
  ) {
    /* istanbul ignore next */
    super(model, value, mutator)
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make(value: any, _parent: Record, key: string): number | null {
    return this.mutate(this.fix(value), key)
  }

  /**
   * Transform given data to the number.
   */
  fix(value: any): number | null {
    if (value === undefined) {
      return this.value
    }

    if (typeof value === 'number') {
      return value
    }

    if (typeof value === 'string') {
      return parseFloat(value)
    }

    if (typeof value === 'boolean') {
      return value ? 1 : 0
    }

    if (value === null && this.isNullable) {
      return value
    }

    return 0
  }
}
