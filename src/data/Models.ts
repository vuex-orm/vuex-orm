import Model from './Model'

export interface Models<M extends Model = Model> {
  [id: string]: Model<M>
}

export default Models
