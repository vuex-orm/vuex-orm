import Instance from '../data/Instance'
import Model from '../model/Model'

export type Collection<T extends Model = Model> = Array<Instance<T>>

export default Collection
