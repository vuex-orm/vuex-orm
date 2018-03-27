import Utils from '../support/Utils'
import Query from '../query/Query'
import { Records, NormalizedData } from './Contract'

export default class IdFixer {
  /**
   * Fix all of the "no key" records with appropriate id value if it can.
   */
  static process (data: NormalizedData, query: Query): NormalizedData {
    return Utils.mapValues(data, (records, entity) => {
      const newQuery = query.newPlainQuery(entity)

      return this.processRecords(records, newQuery)
    })
  }

  /**
   * Process records to Fix all of the "no key" records with
   * appropriate id value if it can.
   */
  static processRecords (records: Records, query: Query): Records {
    return Object.keys(records).reduce((newRecords, id) => {
      const record = records[id]
      const newId = query.model.id(record)
      const newStringId = isNaN(newId) ? newId : newId.toString()

      if (newId === undefined || id === newStringId) {
        newRecords[id] = record

        return newRecords
      }

      newRecords[newStringId] = { ...record, $id: newId }

      return newRecords
    }, {} as Records)
  }
}
