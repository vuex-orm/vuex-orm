import Model from '../../Model'
import PropertyDecorator from '../contracts/PropertyDecorator'

interface Options {
  nullable?: boolean
}

/**
 * Create a bool decorator.
 */
export default function Bool(
  value: boolean | null,
  options: Options = {}
): PropertyDecorator {
  return (target, propertyKey) => {
    const model = target.constructor as typeof Model

    const attr = model.boolean(value)

    if (options.nullable) {
      attr.nullable()
    }

    model.setSchema(propertyKey, attr)
  }
}
