import Model from '../model/Model'
import Instance from './Instance'

export type Item<M extends Model = Model> = Instance<M> | null

export default Item
