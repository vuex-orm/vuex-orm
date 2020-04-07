import { Record } from '../data/Data'
import * as Attributes from './attributes/Attributes'
import Model from './Model'

export default interface Constructor<M extends Model> {
  entity: string

  primaryKey: string

  new (...args: any[]): M

  setSchema<M extends typeof Model>(
    this: M,
    key: string,
    attribute: Attributes.Attribute<M>
  ): M

  attr<M extends typeof Model>(this: M): Attributes.Attribute<M>

  getIndexId(record: Record): string
}
