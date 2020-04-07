import { Record } from '../data/Data'
import Model from './Model'

export default interface Constructor<M extends Model> {
  entity: string
  new (...args: any[]): M
  getIndexId(record: Record): string
}
