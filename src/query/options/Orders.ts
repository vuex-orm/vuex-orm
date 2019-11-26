import Model from '../../model/Model'
import OrderDirection from './OrderDirection'
import OrderKey from './OrderKey'


export interface Orders<T extends Model = Model> {
  key: OrderKey<T>
  direction: OrderDirection
}

export default Orders
