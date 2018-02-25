import * as _ from '../support/lodash'
import { Records, NormalizedData } from '../data/Contract'
import Increment from '../attributes/types/Increment'
import Repo from '../repo/Repo'

export default class Incrementer {
  /**
   * The repo instance.
   */
  repo: Repo

  /**
   * Create a new incrementer instance.
   */
  constructor (repo: Repo) {
    this.repo = repo
  }

  /**
   * Increment fields that have increment attribute.
   */
  static increment (data: NormalizedData, repo: Repo): NormalizedData {
    return (new this(repo)).increment(data)
  }

  /**
   * Increment fields that have increment attribute.
   */
  increment (data: NormalizedData): NormalizedData {
    return _.mapValues(data, (record, entity) => {
      const repo = new Repo(this.repo.state, entity, false)

      // If the entity doesn't have increment attribute, do nothing and
      // just return immediately.
      if (!repo.entity.hasIncrementFields()) {
        return record
      }

      return this.process(record, repo)
    })
  }

  /**
   * Process the incrementation.
   */
  process (records: Records, repo: Repo): Records {
    let newRecords = { ...records }

    _.forEach(repo.entity.incrementFields(), (field) => {
      const incrementKey = this.incrementKey(field)

      let max = this.max(records, repo, incrementKey)

      _.forEach(records, (_record, key) => {
        if (newRecords[key][incrementKey]) {
          return
        }

        newRecords[key][incrementKey] = ++max

        newRecords[key]['$id'] = repo.entity.id(newRecords[key])
      })
    })

    return this.setId(newRecords, repo)
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
  max (data: any, repo: Repo, field: string): number {
    const max: number = repo.max(field)
    const records: any = _.map(data, value => value)
    const maxRecord: any = _.maxBy(records, field)

    return maxRecord ? _.max([max, maxRecord[field]]) : max
  }

  /**
   * Update the key of the records.
   */
  setId (records: Records, repo: Repo): Records {
    let newRecords: Records = {}

    _.forEach(records, (record) => {
      newRecords[repo.entity.id(record)] = record
    })

    return newRecords
  }
}
