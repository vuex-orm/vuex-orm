import Model from '../../Model'
import Attribute from '../Attribute'

export default abstract class Type<M extends typeof Model> extends Attribute<
  M
> {
  /**
   * The default value for the attribute.
   */
  protected value: any

  /**
   * Whether if the attribute accepts `null` value or not.
   */
  protected isNullable: boolean = false

  /**
   * Create a new type attribute instance.
   */
  constructor(model: M, value: any = null) {
    super(model)
    this.value = value
  }

  /**
   * Set the nullable option to true.
   */
  nullable(): this {
    this.isNullable = true

    return this
  }
}
