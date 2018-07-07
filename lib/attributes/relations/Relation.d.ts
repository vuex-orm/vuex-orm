import { Record, Records, NormalizedData } from '../../data';
import Query, { Relation as Load } from '../../query/Query';
import { Fields } from '../contracts/Contract';
import Attribute from '../Attribute';
export default abstract class Relation extends Attribute {
    /**
     * Attach the relational key to the given record.
     */
    abstract attach(key: any, record: Record, data: NormalizedData): void;
    /**
     * Load relationship records.
     */
    abstract load(query: Query, collection: Record[], relation: Load): Record | Record[] | null;
    /**
     * Create a new map of the record by given key.
     */
    mapRecords(records: Record[], key: string): Records;
    /**
     * Get the path of the related field. It returns path as a dot-separated
     * string something like `settings.accounts`.
     */
    relatedPath(key: string, fields?: Fields, parent?: string): string;
    /**
     * Set given related records to the item.
     */
    setRelated(item: Record, related: Record | Record[] | null, path: string): Record;
    /**
     * Add constraint to the query.
     */
    addConstraint(query: Query, relation: Load): void;
}
