import { normalize } from 'normalizr'
import Repo from '../repo/Repo'
import { NormalizedData } from './Contract'
import Schema from './Schema'
import Builder from './Builder'
import Incrementer from './Incrementer'

export default class Data {
  /**
   * Normalize the data.
   */
  static normalize (data: any, repo: Repo): NormalizedData {
    const schema = Array.isArray(data) ? Schema.many(repo.entity) : Schema.one(repo.entity)

    return normalize(data, schema).entities
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
