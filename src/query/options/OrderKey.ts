import Model from '../../model/Model'

type OrderKeyFunc<T> = (record: T) => any
export type OrderKey<T extends Model = Model> = OrderKeyFunc<T> | string

export default OrderKey