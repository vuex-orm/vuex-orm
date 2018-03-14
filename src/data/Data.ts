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
  static normalize (data: any, query: Query): NormalizedData {
    const normalizedData = Normalizer.normalize(data, query)

    const attachedData = Attacher.attach(normalizedData, query)

    return Incrementer.increment(attachedData, query)
  }

  /**
   * Fill missing records with default value based on model schema.
   */
  static fillAll (data: NormalizedData, query: Query): NormalizedData {
    return Builder.build(data, query)
  }
}
