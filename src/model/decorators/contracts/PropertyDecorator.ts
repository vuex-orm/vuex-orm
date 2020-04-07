import Model from '../../Model'

type PropertyDecorator = (target: Model, propertyKey: string) => void

export default PropertyDecorator
