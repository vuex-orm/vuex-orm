import Model from '../../model/Model'
import Attribute from '../Attribute'

export default abstract class Type extends Attribute {
  /**
   * The mutator for the field.
   */
  mutator?: (value: any) => any

  /**
   * Create a new type instance.
   */
  constructor (model: typeof Model, mutator?: (value: any) => any) {
    super(model) /* istanbul ignore next */

    this.mutator = mutator
  }

  /**
   * Mutate the given value by mutator.
   */
  mutate (value: any, key: string): any {
    const mutator = this.mutator || this.model.mutators()[key]

    return mutator ? mutator(value) : value
  }
}
