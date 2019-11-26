import Model from '../../model/Model'

export type OrderKey<T extends Model = Model> = string | ((record: T) => any)

export default OrderKey
