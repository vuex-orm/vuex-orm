import { normalize } from 'normalizr'
import * as _ from '../support/lodash'
import Repo from '../repo/Repo'
import { NormalizedData } from './Contract'
import Schema from './Schema'
import PivotCreator from './PivotCreator'

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
}
