import { Record, Records } from '../../data/Contract'
import Query from '../Query'

export type Condition = number | string | Predicate

export type Predicate = (item: Record, key: string) => boolean

export default class Delete {
  /**
   * The query instance.
   */
  query: Query

  /**
   * Create a new delete instance.
   */
  constructor (query: Query) {
    this.query = query
  }

  /**
   * Delete a record.
   */
  delete (condition: Condition): void {
    condition = this.createCondition(condition)

    this.query.state.data = this.pickBy(condition)
  }

  /**
   * Delete all records from the state.
   */
  deleteAll (): void {
    this.query.state.data = {}
  }

  /**
   * Create condition closure.
   */
  private createCondition (condition: Condition): Predicate {
    if (typeof condition === 'function') {
      return (record, key) => !condition(record, key)
    }

    const id = typeof condition === 'number' ? condition.toString() : condition

    return (_record, key) => key !== id
  }

  /**
   * Filter through the state and retrieve only the appropriate records.
   */
  private pickBy (condition: Predicate): Records {
    return Object.keys(this.query.state.data).reduce((records, key) => {
      const record = this.query.state.data[key]

      if (condition(record, key)) {
        records[key] = record
      }

      return records
    }, {} as Records)
  }
}
