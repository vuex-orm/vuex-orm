import { Model } from '../../../Model'
import { PropertyDecorator } from '../../Contracts'

/**
 * Create a has many decorator.
 */
export function HasMany(
  related: () => typeof Model,
  foreignKey: string,
  localKey?: string
): PropertyDecorator {
  return (target, propertyKey) => {
    target.$self.setRegistry(propertyKey, () =>
      target.$self.hasMany(related(), foreignKey, localKey)
    )
  }
}
