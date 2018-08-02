import BaseModel from '../../model/BaseModel'
import NoKey from './NoKey'

export type Attribute = (value: any, parent: any, key: string) => any

export default class IdAttribute {
  /**
   * Create the id attribute.
   */
  static create (noKey: NoKey, model: typeof BaseModel): Attribute {
    return (value: any, _parent: any, key: string) => {
      const id = model.id(value)

      return id !== undefined ? id : noKey.get(key)
    }
  }
}
