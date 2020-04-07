import Model from '../../Model'
import Type from './Type'

export default class String<M extends typeof Model> extends Type<M> {
  /**
   * Create a new string attribute.
   */
  constructor(model: M, value: string | null) {
    super(model, value)
  }

  /**
   * Make the value for the attribute.
   */
  make(value: any): string | null {
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
