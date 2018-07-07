import Query from '../../query/Query';
import NormalizedData from '../NormalizedData';
export default class Incrementer {
    /**
     * Increment all fields that have increment attribute.
     */
    static process(data: NormalizedData, query: Query): NormalizedData;
    /**
     * Process all of the increment fields.
     */
    private static processRecordsByFields;
    /**
     * Process all records and increment all field that is defined as increment.
     */
    private static processRecords;
    /**
     * Get the max value of the specified field with given data combined
     * with existing records.
     */
    private static max;
}
