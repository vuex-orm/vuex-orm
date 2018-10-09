import Record from '../../data/Record'
import Model from '../../model/Model'
import Type from './Type'

export default class Increment extends Type {
  /**
   * The initial count to start incrementing.
   */
  value: number = 1

  /**
   * Create a new increment instance.
   */
  constructor (model: typeof Model) {
    super(model) /* istanbul ignore next */
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make (value: any, _parent: Record, _key: string): number | null {
    return typeof value === 'number' ? value : null
  }
}
