import { schema } from 'normalizr'
import Uid from '../support/Uid'
import Record from '../data/Record'
import UidAttribute from '../attributes/types/Uid'
import Model from '../model/Model'

export default class IdAttribute {
  /**
   * Creates a closure that generates the required id's for an entity.
   */
  static create (model: typeof Model): schema.StrategyFunction<string> {
    return (value: any, _parentValue: any, _key: string): string => {
      this.generateIds(value, model)

      const indexId = this.generateIndexId(value, model)

      return indexId
    }
  }

  /**
   * Generate a field that is defined as primary keys. For keys with a proper
   * value set, it will do nothing. If a key is missing, it will generate
   * UID for it.
   */
  private static generateIds (record: Record, model: typeof Model): void {
    const keys = Array.isArray(model.primaryKey) ? model.primaryKey : [model.primaryKey]

    keys.forEach((k) => {
      if (record[k] !== undefined && record[k] !== null) {
        return
      }

      const attr = model.getFields()[k]

      record[k] = attr instanceof UidAttribute ? attr.make() : Uid.make()
    })
  }

  /**
   * Generate index id field (which is `$id`) and attach to the given record.
   */
  private static generateIndexId (record: Record, model: typeof Model): string {
    record.$id = model.getIndexIdFromRecord(record)

    return record.$id
  }
}
