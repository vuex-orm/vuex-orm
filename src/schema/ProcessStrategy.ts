import Record from '../data/Record'
import Model from '../model/Model'
import NoKey from './NoKey'

export type Strategy = (value: any, parent: any, key: string) => any

export default class ProcessStrategy {
  /**
   * Create the process strategy.
   */
  static create (model: typeof Model): Strategy {
    return (value: any, _parentValue: any, _key: string): Record => {
      const id = model.getIndexIdFromRecord(value)

      return { ...value, $id: id === null ? NoKey.increment() : id }
    }
  }
}
