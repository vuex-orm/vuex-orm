import Record from '../../data/Record'
import NormalizedData from '../../data/NormalizedData'
import Query from '../Query'
import Normalizer from './Normalizer'
import PivotCreator from './PivotCreator'
import Incrementer from './Incrementer'
import Attacher from './Attacher'
import IdFixer from './IdFixer'

export default class Processor {
  /**
   * Normalize the given data.
   */
  static normalize (query: Query, record: Record | Record[]): NormalizedData {
    let data = Normalizer.process(query, record)

    data = PivotCreator.process(query, data)
    data = Incrementer.process(query, data)
    data = Attacher.process(query, data)
    data = IdFixer.process(query, data)

    return data
  }
}
