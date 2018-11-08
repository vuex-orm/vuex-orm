import Record from '../../data/Record'
import Model from '../../model/Model'
import Type from './Type'

export default class Number extends Type {
  /**
   * The default value of the field.
   */
  value: number

  /**
   * Whether if it can accept `null` as a value.
   */
  isNullable: boolean = false

  /**
   * Create a new number instance.
   */
  constructor (model: typeof Model, value: number, mutator?: (value: any) => any) {
    super(model, mutator) /* istanbul ignore next */

    this.value = value
  }

  /**
   * Set `nullable` to be `true`.
   */
  nullable (): this {
    this.isNullable = true

    return this
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make (value: any, _parent: Record, key: string): any {
    return this.mutate(this.fix(value), key)
  }

  /**
   * Transform given data to the number.
   */
  fix (value: any): number {
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
