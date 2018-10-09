import Utils from '../../support/Utils'
import Records from '../../data/Records'
import NormalizedData from '../../data/NormalizedData'
import Query from '../../query/Query'

export default class IdFixer {
  /**
   * Fix all of the "no key" records with appropriate id value if it can.
   */
  static process (query: Query, data: NormalizedData): NormalizedData {
    return Utils.mapValues(data, (records, entity) => {
      const newQuery = query.newQuery(entity)

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
