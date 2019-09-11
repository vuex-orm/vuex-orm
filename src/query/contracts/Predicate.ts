import Model from '../../model/Model'

export type Predicate<M extends Model = Model> = (model: M) => boolean

export default Predicate
