import Model from '../model/Model'
import ProcessStrategy from './ProcessStrategy'

export type Attribute = (value: any, parent: any, key: string) => any

export default class IdAttribute {
  /**
   * Create the id attribute.
   */
  static create (model: typeof Model): Attribute {
    return (value: any, _parent: any, _key: string) => {
      const id = model.id(value)

      return id !== undefined ? id : ProcessStrategy.noKey()
    }
  }
}
