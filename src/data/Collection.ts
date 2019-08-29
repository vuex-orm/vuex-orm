import Model from './Model'

export type Collection<M extends Model = Model> = Model<M>[]

export default Collection
