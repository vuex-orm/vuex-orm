import Instance from './Instance'
import Model from '../model/Model'

export interface Instances<T extends Model = Model> {
  [id: string]: Instance<T>
}

export default Instances
