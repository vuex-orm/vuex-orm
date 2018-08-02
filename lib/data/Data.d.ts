import Query from '../query/Query';
import NormalizedData from './NormalizedData';
export default class Data {
    /**
     * Normalize the data.
     */
    static normalize(data: any, query: Query): NormalizedData;
}
