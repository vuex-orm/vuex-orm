import Query from '../../query/Query';
import NormalizedData from '../NormalizedData';
export default class Normalizer {
    /**
     * Normalize the data.
     */
    static process(data: any, Query: Query): NormalizedData;
}
