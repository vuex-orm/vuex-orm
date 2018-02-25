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
    const normalizedData = Normalizer.normalize(data, repo)

    const attachedData = Attacher.attach(normalizedData, repo)

    return Incrementer.increment(attachedData, repo)
  }

  /**
   * Fill missing records with default value based on model schema.
   */
  static fillAll (data: NormalizedData, repo: Repo): NormalizedData {
    return Builder.build(data, repo)
  }
}
