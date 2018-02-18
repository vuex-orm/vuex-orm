import { normalize } from 'normalizr'
import * as _ from '../support/lodash'
import Repo from '../repo/Repo'
import { NormalizedData } from './Contract'
import Schema from './Schema'
import Builder from './Builder'
import PivotCreator from './PivotCreator'
import Incrementer from './Incrementer'

export default class Data {
  /**
   * Normalize the data.
   */
  static normalize (data: any, repo: Repo): NormalizedData {
    if (_.isEmpty(data)) {
      return {}
    }

    const schema = Array.isArray(data) ? Schema.many(repo.entity) : Schema.one(repo.entity)

    const normalizedData = normalize(data, schema).entities

    return PivotCreator.create(normalizedData, repo)
  }

  /**
   * Fill missing records with default value based on model schema.
   */
  static fill (data: NormalizedData, repo: Repo, reset: boolean = false): NormalizedData {
    let records: NormalizedData = {}

    records = Builder.build(data, repo)
    records = Incrementer.increment(records, repo, reset)

    return records
  }
}
