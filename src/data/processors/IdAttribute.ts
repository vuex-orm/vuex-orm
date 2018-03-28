import Model from '../../model/Model'
import NoKey from './NoKey'

export type Attribute = (value: any, parent: any, key: string) => any

export default class IdAttribute {
  /**
   * Create the id attribute.
   */
  static create (noKey: NoKey, model: typeof Model): Attribute {
    return (value: any, _parent: any, key: string) => {
      const id = model.id(value)

      return id !== undefined ? id : noKey.get(key)
    }
  }
}
