import Model from '../../Model'
import PropertyDecorator from '../contracts/PropertyDecorator'

/**
 * Create an attr decorator.
 */
export default function Attr(): PropertyDecorator {
  return (target, propertyKey) => {
    const model = target.constructor as typeof Model

    model.setSchema(propertyKey, model.attr())
  }
}
