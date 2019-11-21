import { schema } from 'normalizr'
import Uuid from '../support/Uuid'
import Record from '../data/Record'
import Model from '../model/Model'

export default class ProcessStrategy {
  /**
   * Create the process strategy.
   */
  static create (model: typeof Model): schema.StrategyFunction<Record> {
    return (value: any, _parentValue: any, _key: string): Record => {
      this.generateIds(value, model)

      this.generateIndexId(value, model)

      return value
    }
  }

  /**
   * Generate a field that is defined as primary keys. For keys with a proper
   * value set, it will do nothing. If a key is missing, it will generate
   * UUID for it.
   */
  private static generateIds (record: Record, model: typeof Model): void {
    const keys = Array.isArray(model.primaryKey) ? model.primaryKey : [model.primaryKey]

    keys.forEach((k) => {
      if (record[k] !== undefined && record[k] !== null) {
        return
      }

      record[k] = Uuid.make()
    })
  }

  /**
   * Generate index id field (which is `$id`) and attach to the given record.
   */
  private static generateIndexId (record: Record, model: typeof Model): void {
    record.$id = model.getIndexIdFromRecord(record)
  }
}
