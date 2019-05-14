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
    // First, let's normalize the data.
    let data = Normalizer.process(query, record)

    // Next, increment any field that defined with `increment` attribute.
    data = Incrementer.process(query, data)

    // Then, attach any missing foreign keys. For example, if a User has many
    // Post nested but without foreign key such as `user_id`, we can attach
    // the `user_id` value to the Post entities.
    data = Attacher.process(query, data)

    // Now we'll create any missing pivot entities for relationships such as
    // `belongsTo` or `morphMany`.
    data = PivotCreator.process(query, data)

    // There might be new pivot entities now which weren't there before, and
    // it might contain increment field so we must increment those filed
    // again here.
    //
    // Improvements: This double incrementing process can be improved. Since
    // currently, we're looping whole records twice. If we could remember the
    // entities which were already incremented at an earlier stage, we could
    // only process the newly created entities.
    data = Incrementer.process(query, data)

    // Finally, let's fix key id for the entities since the id value might
    // have changed due to the incrementing process.
    data = IdFixer.process(query, data)

    // And we'll return the result as a normalized data.
    return data
  }
}
