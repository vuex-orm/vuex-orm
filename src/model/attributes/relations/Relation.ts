import Model from '../../Model'
import Attribute from '../Attribute'

export default abstract class Relelation<
  P extends typeof Model,
  R extends typeof Model
> extends Attribute<P> {
  /**
   * The parent model.
   */
  protected parent: P

  /**
   * The related model.
   */
  protected related: R

  /**
   * Create a new relation instance.
   */
  constructor(parent: P, related: R) {
    super(parent)
    this.parent = parent
    this.related = related
  }
}
