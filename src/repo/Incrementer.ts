import * as _ from '../support/lodash'
import { Records } from '../Data'
import { Increment } from '../Attributes/Types'
import Repo from './Repo'

export default class Incrementer {
  /**
   * The repo instance.
   */
  protected repo: Repo

  /**
   * Create a new incrementer instance.
   */
  constructor (repo: Repo) {
    this.repo = repo
  }

  /**
   * Increment all fields with `incremented` attribute type.
   */
  incrementFields (data: Records, reset: boolean = false): Records {
    return this.repo.entity.hasIncrementFields ? this.process(data, reset) : data
  }

  /**
   * Process the incrementation.
   */
  process (data: Records, reset: boolean = false): any {
    const newData = { ...data }

    _.forEach(this.repo.entity.incrementFields(), (field) => {
      const incrementKey = this.incrementKey(field)

      let max = this.max(data, incrementKey, reset)

      _.forEach(data, (_record, fieldKey) => {
        if (newData[fieldKey][incrementKey]) {
          return
        }

        newData[fieldKey][incrementKey] = ++max
      })
    })

    return newData
  }

  /**
   * Get key of the increment field.
   */
  incrementKey (field: { [key: string]: Increment }): string {
    return Object.keys(field)[0]
  }

  /**
   * Get the max value of the specified field with given data combined
   * with existing records.
   */
  max (data: any, field: string, reset: boolean = false): number {
    let max = reset ? 0 : this.repo.self().max(this.repo.state, this.repo.name, field)

    const records = _.map(data, v => v)
    const maxRecord: any = _.maxBy(records, field)

    if (maxRecord) {
      max = _.max([max, maxRecord[field]])
    }

    return max
  }
}
