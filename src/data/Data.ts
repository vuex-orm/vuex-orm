import Query from '../query/Query'
import { NormalizedData } from './Contract'
import Normalizer from './Normalizer'
import Attacher from './Attacher'
import Builder from './Builder'
import Incrementer from './Incrementer'

export default class Data {
  /**
   * Normalize the data.
   */
  static normalize (data: any, Query: Query): NormalizedData {
    const normalizedData = Normalizer.normalize(data, Query)

    const attachedData = Attacher.attach(normalizedData, Query)

    return Incrementer.increment(attachedData, Query)
  }

  /**
   * Fill missing records with default value based on model schema.
   */
  static fillAll (data: NormalizedData, Query: Query): NormalizedData {
    return Builder.build(data, Query)
  }
}
