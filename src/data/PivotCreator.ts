import * as _ from '../support/lodash'
import Repo from '../repo/Repo'
import { NormalizedData } from './Contract'

export default class PivotCreator {
  static create (data: NormalizedData, repo: Repo): NormalizedData {
    if (!repo.entity.hasPivotFields()) {
      return data
    }

    _.forEach(repo.entity.pivotFields(), (field) => {
      _.forEach(field, attr => { attr.createPivots(repo.entity, data) })
    })

    return data
  }
}
