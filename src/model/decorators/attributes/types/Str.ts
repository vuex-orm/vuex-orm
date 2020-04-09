import { PropertyDecorator, TypeOptions } from '../../Contracts'

/**
 * Create a str decorator.
 */
export function Str(
  value: string | null,
  options: TypeOptions = {}
): PropertyDecorator {
  return (target, propertyKey) => {
    target.$self.setRegistry(propertyKey, () => {
      const attr = target.$self.string(value)

      if (options.nullable) {
        attr.nullable()
      }

      return attr
    })
  }
}
