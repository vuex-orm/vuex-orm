import Repo from '../repo/Repo'
import { NormalizedData } from './Contract'
import Normalizer from './Normalizer'
import Attacher from './Attacher'
import Builder from './Builder'
import Incrementer from './Incrementer'

export default class Data {
  /**
   * Normalize the data.
   */
  static normalize (data: any, repo: Repo): NormalizedData {
    return Normalizer.normalize(data, repo)
  }

  /**
   * Fill missing records with default value based on model schema.
   */
  static fillAll (data: NormalizedData, repo: Repo): NormalizedData {
    let records: NormalizedData = { ...data }

    records = Attacher.attach(records, repo)
    records = Builder.build(records, repo)
    records = Incrementer.increment(records, repo)

    return records
  }
}
