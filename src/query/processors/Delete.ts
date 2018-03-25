import Utils from '../../support/Utils'
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
   * Create a new delete processor instance.
   */
  constructor (query: Query) {
    this.query = query
  }

  /**
   * Delete a record from the state.
   */
  delete (condition: Condition): void {
    condition = this.createCondition(condition)

    this.query.state.data = Utils.pickBy(this.query.state.data, condition)
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
}
