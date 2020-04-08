import Model from '../../Model'
import Relation from './Relation'

export default class String<
  P extends typeof Model,
  R extends typeof Model
> extends Relation<P, R> {
  /**
   * The foreign key of the parent model.
   */
  protected foreignKey: string

  /**
   * The local key of the parent model.
   */
  protected localKey: string

  /**
   * Create a new has one relation instance.
   */
  constructor(parent: P, related: R, foreignKey: string, localKey: string) {
    super(parent, related)
    this.foreignKey = foreignKey
    this.localKey = localKey
  }

  /**
   * Make the value for the attribute.
   */
  make(_value: any): null {
    return null
  }
}
