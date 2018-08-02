import Query from '../../query/Query';
import Records from '../Records';
import NormalizedData from '../NormalizedData';
export default class IdFixer {
    /**
     * Fix all of the "no key" records with appropriate id value if it can.
     */
    static process(data: NormalizedData, query: Query): NormalizedData;
    /**
     * Process records to Fix all of the "no key" records with
     * appropriate id value if it can.
     */
    static processRecords(records: Records, query: Query): Records;
}
