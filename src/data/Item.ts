import Model from './Model'

export type Item<M extends Model = Model> = Model<M> | null

export default Item
