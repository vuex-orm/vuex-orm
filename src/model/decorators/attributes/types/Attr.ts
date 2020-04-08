import { PropertyDecorator } from '../../Contracts'

/**
 * Create an attr decorator.
 */
export default function Attr(value?: any): PropertyDecorator {
  return (target, propertyKey) => {
    target.$self.setRegistry(propertyKey, () => target.$self.attr(value))
  }
}
