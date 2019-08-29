import Collection from './Collection'
import Model from './Model'

export interface Collections<M extends Model = Model> {
  [entity: string]: Collection<M>
}

export default Collections
