import Query from '../query/Query'
import Normalizer from './processors/Normalizer'
import Incrementer from './processors/Incrementer'
import Attacher from './processors/Attacher'
import IdFixer from './processors/IdFixer'
import NormalizedData from './NormalizedData'

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
}
