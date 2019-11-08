import Model from '../model/Model'
import NoKey from './NoKey'

export type Attribute = (value: any, parent: any, key: string) => any

export default class IdAttribute {
  /**
   * Create the id attribute.
   */
  static create (model: typeof Model): Attribute {
    return (value: any, _parent: any, _key: string): string | number => {
      const id = model.getIndexIdFromRecord(value)

      if (id === null) {
        return NoKey.get()
      }

      return id
    }
  }
}
