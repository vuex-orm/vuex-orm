import { PropertyDecorator, TypeOptions } from '../../Contracts'

/**
 * Create a str decorator.
 */
export function Num(
  value: number | null,
  options: TypeOptions = {}
): PropertyDecorator {
  return (target, propertyKey) => {
    target.$self.setRegistry(propertyKey, () => {
      const attr = target.$self.number(value)

      if (options.nullable) {
        attr.nullable()
      }

      return attr
    })
  }
}
