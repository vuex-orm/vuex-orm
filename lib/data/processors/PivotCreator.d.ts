import Query from '../../query/Query';
import NormalizedData from '../NormalizedData';
export default class PivotCreator {
    /**
     * Create an intermediate entity if the data contains any entities that
     * require it for example `belongsTo` or `morphMany`.
     */
    static process(data: NormalizedData, Query: Query): NormalizedData;
}
