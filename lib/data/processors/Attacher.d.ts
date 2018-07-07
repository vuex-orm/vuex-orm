import Query from '../../query/Query';
import NormalizedData from '../NormalizedData';
export default class Attacher {
    /**
     * Attach missing relational key to the records.
     */
    static process(data: NormalizedData, Query: Query): NormalizedData;
}
