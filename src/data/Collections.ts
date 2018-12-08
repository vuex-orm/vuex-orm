import Collection from './Collection'
import Model from '../model/Model'

export interface Collections<T extends Model = Model> {
  [entity: string]: Collection<T>
}

export default Collections
