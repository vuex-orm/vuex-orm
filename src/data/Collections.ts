import Model from '../model/Model'
import Collection from './Collection'

export interface Collections<M extends Model = Model> {
  [entity: string]: Collection<M>
}

export default Collections
