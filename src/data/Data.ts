import Query from '../query/Query'
import { NormalizedData } from './Contract'
import Normalizer from './Normalizer'
import Incrementer from './Incrementer'
import Attacher from './Attacher'
import IdFixer from './IdFixer'
import Builder from './Builder'

export default class Data {
  /**
   * Normalize the data.
   */
  static normalize (data: any, query: Query): NormalizedData {
    data = Normalizer.process(data, query)
    data = Incrementer.process(data, query)
    data = Attacher.process(data, query)
    data = IdFixer.process(data, query)

    return data
  }

  /**
   * Fill missing records with default value based on model schema.
   */
  static fillAll (data: NormalizedData, query: Query): NormalizedData {
    return Builder.build(data, query)
  }
}
