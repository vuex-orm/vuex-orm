import { PropertyDecorator, TypeOptions } from '../../Contracts'

/**
 * Create a str decorator.
 */
export default function Str(
  value: boolean | null,
  options: TypeOptions = {}
): PropertyDecorator {
  return (target, propertyKey) => {
    const attr = target.$self.boolean(value)

    if (options.nullable) {
      attr.nullable()
    }

    target.$self.setSchema(propertyKey, attr)
  }
}
