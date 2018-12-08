import Instance from '../data/Instance'
import Model from '../model/Model'

export type Item<T extends Model = Model> = Instance<T> | null

export default Item
