import Model from '../../Model'
import Attribute from '../Attribute'

export default abstract class Type<M extends typeof Model> extends Attribute<
  M
> {}
