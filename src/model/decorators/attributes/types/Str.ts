import { PropertyDecorator, TypeOptions } from '../../Contracts'

/**
 * Create a str decorator.
 */
export default function Str(
  value: string | null,
  options: TypeOptions = {}
): PropertyDecorator {
  return (target, propertyKey) => {
    const attr = target.$self.string(value)

    if (options.nullable) {
      attr.nullable()
    }

    target.$self.setSchema(propertyKey, attr)
  }
}
