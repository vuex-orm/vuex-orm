import Utils from '../../support/Utils'
import Records from '../../data/Records'
import NormalizedData from '../../data/NormalizedData'
import Query from '../../query/Query'

export default class Incrementer {
  /**
   * Increment all fields that have increment attribute.
   */
  static process (query: Query, data: NormalizedData): NormalizedData {
    return Utils.mapValues(data, (records, entity) => {
      const newQuery = query.newQuery(entity)

      // If the entity doesn't have increment attribute, do nothing and
      // just return immediately.
      if (!newQuery.model.hasIncrementFields()) {
        return records
      }

      this.processRecordsByFields(records, newQuery)

      return records
    })
  }

  /**
   * Process all of the increment fields.
   */
  private static processRecordsByFields (records: Records, query: Query): void {
    const fields = query.model.getIncrementFields()

    Utils.forOwn(fields, (_attr, key) => {
      this.processRecords(records, query, key)
    })
  }

  /**
   * Process all records and increment all field that is defined as increment.
   */
  private static processRecords (records: Records, query: Query, key: string): void {
    let max = this.max(records, query, key)

    Utils.forOwn(records, (record) => {
      if (typeof record[key] !== 'number') {
        record[key] = ++max
      }
    })
  }

  /**
   * Get the max value of the specified field with given data combined
   * with existing records.
   */
  private static max (records: Records, query: Query, field: string): number {
    const maxInState = query.max(field)

    const maxInRecord = Math.max(...Utils.map(records, record => {
      const id = record[field]

      return typeof id === 'number' ? id : 0
    }))

    return Math.max(maxInRecord, maxInState)
  }
}
