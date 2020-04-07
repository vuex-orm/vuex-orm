import Model from '../../Model'
import Type from './Type'

export default class Number<M extends typeof Model> extends Type<M> {
  /**
   * Create a new number attribute.
   */
  constructor(model: M, value: number | null) {
    super(model, value)
  }

  /**
   * Make the value for the attribute.
   */
  make(value: any): number | null {
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
