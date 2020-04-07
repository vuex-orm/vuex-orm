import Model from '../../Model'
import PropertyDecorator from '../contracts/PropertyDecorator'

interface Options {
  nullable?: boolean
}

/**
 * Create a num decorator.
 */
export default function Num(
  value: number | null,
  options: Options = {}
): PropertyDecorator {
  return (target, propertyKey) => {
    const model = target.constructor as typeof Model

    const attr = model.number(value)

    if (options.nullable) {
      attr.nullable()
    }

    model.setSchema(propertyKey, attr)
  }
}
