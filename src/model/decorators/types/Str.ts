import Model from '../../Model'
import PropertyDecorator from '../contracts/PropertyDecorator'

/**
 * Create a str decorator.
 */
export default function Str(): PropertyDecorator {
  return (target, propertyKey) => {
    const model = target.constructor as typeof Model

    model.setSchema(propertyKey, model.string())
  }
}
