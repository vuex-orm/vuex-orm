import Model from '../../model/Model'
import OrderKey from './OrderKey'
import OrderDirection from './OrderDirection'

export interface Orders<T extends Model = Model> {
  key: OrderKey<T>
  direction: OrderDirection
}

export default Orders
