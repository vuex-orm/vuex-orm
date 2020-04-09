import { Model } from '../../../Model'
import { PropertyDecorator } from '../../Contracts'

/**
 * Create a belongs to decorator.
 */
export function BelongsTo(
  related: () => typeof Model,
  foreignKey: string,
  ownerKey?: string
): PropertyDecorator {
  return (target, propertyKey) => {
    target.$self.setRegistry(propertyKey, () =>
      target.$self.belongsTo(related(), foreignKey, ownerKey)
    )
  }
}
