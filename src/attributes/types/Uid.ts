import UidGenerator from '../../support/Uid'
import Model from '../../model/Model'
import Type from './Type'

export default class Uid extends Type {
  /**
   * Hardcoded type for introspection
   */
  readonly className: string = 'Uid'

  /**
   * Create a new uid instance.
   */
  constructor(model: typeof Model, value?: () => string | number) {
    /* istanbul ignore next */
    super(model, value)
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make(value?: any): string | number | null {
    if (typeof value === 'number' || typeof value === 'string') {
      return value
    }

    if (typeof this.value === 'function') {
      return this.value()
    }

    return UidGenerator.make()
  }
}
