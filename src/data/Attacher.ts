import Utils from '../support/Utils'
import Relation from '../attributes/relations/Relation'
import Repo from '../repo/Repo'
import { NormalizedData } from './Contract'

export default class Attacher {
  /**
   * Attach missing relational key to the records.
   */
  static attach (data: NormalizedData, repo: Repo): NormalizedData {
    Utils.forOwn(data, (entity, name) => {
      const fields = repo.model(name).fields()

      Utils.forOwn(entity, (record) => {
        Utils.forOwn(record, (value, key) => {
          const field = fields[key]

          if (field instanceof Relation) {
            field.attach(value, record, data)
          }
        })
      })
    })

    return data
  }
}
