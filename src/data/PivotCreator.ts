import * as _ from '../support/lodash'
import Repo from '../repo/Repo'
import { NormalizedData } from './Contract'

export default class PivotCreator {
  static create (data: NormalizedData, repo: Repo): NormalizedData {
    if (!repo.model.hasPivotFields()) {
      return data
    }

    _.forEach(repo.model.pivotFields(), (field) => {
      _.forEach(field, attr => { attr.createPivots(repo.model, data) })
    })

    return data
  }
}
