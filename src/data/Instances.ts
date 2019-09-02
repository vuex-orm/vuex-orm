import Instance from './Instance'
import Model from '../model/Model'

export interface Instances<M extends Model = Model> {
  [id: string]: Instance<M>
}

export default Instances
