import Model from '../model/Model'
import NoKey from './NoKey'

export type Strategy = (value: any, parent: any, key: string) => any

export default class ProcessStrategy {
  /**
   * Create the process strategy.
   */
  static create (model: typeof Model): Strategy {
    return (value: any, _parentValue: any, _key: string) => {
      const id = this.getId(model, value)

      return { ...value, $id: id }
    }
  }

  /**
   * Get the ID value for the given record.
   */
  static getId (model: typeof Model, value: any): string {
    const id = model.id(value)

    return id !== undefined ? id : NoKey.increment()
  }
}
