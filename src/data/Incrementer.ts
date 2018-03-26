import Utils from '../support/Utils'
import { Records, NormalizedData } from '../data/Contract'
import Increment from '../attributes/types/Increment'
import Query from '../query/Query'

export default class Incrementer {
  /**
   * The Query instance.
   */
  query: Query

  /**
   * Create a new incrementer instance.
   */
  constructor (query: Query) {
    this.query = query
  }

  /**
   * Increment fields that have increment attribute.
   */
  static increment (data: NormalizedData, Query: Query): NormalizedData {
    return (new this(Query)).increment(data)
  }

  /**
   * Increment fields that have increment attribute.
   */
  increment (data: NormalizedData): NormalizedData {
    return Utils.mapValues(data, (record, entity) => {
      const query = new Query(this.query.rootState, entity, false)

      // If the entity doesn't have increment attribute, do nothing and
      // just return immediately.
      if (!query.model.hasIncrementFields()) {
        return record
      }

      return this.process(record, query)
    })
  }

  /**
   * Process the incrementation.
   */
  process (records: Records, query: Query): Records {
    let newRecords = { ...records }

    Utils.forOwn(query.model.incrementFields(), (field) => {
      const incrementKey = this.incrementKey(field)

      let max = this.max(records, query, incrementKey)

      Utils.forOwn(records, (_record, key) => {
        if (newRecords[key][incrementKey]) {
          return
        }

        newRecords[key][incrementKey] = ++max

        newRecords[key]['$id'] = query.model.id(newRecords[key])
      })
    })

    return this.setId(newRecords, query)
  }

  /**
   * Get key of the field that should be incremented.
   */
  incrementKey (field: { [key: string]: Increment }): string {
    return Object.keys(field)[0]
  }

  /**
   * Get the max value of the specified field with given data combined
   * with existing records.
   */
  max (data: any, query: Query, field: string): number {
    const max: number = query.max(field)
    const records: any = Utils.map(data, value => value)
    const maxRecord: any = Math.max(...records.map((record: any) => record[field] || 0))

    return maxRecord ? Math.max(max, maxRecord) : max
  }

  /**
   * Update the key of the records.
   */
  setId (records: Records, query: Query): Records {
    let newRecords: Records = {}

    Utils.forOwn(records, (record) => {
      newRecords[query.model.id(record)] = record
    })

    return newRecords
  }
}
