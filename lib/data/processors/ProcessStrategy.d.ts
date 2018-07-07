import BaseModel from '../../model/BaseModel';
import { Fields, Relation } from '../../attributes/contracts/Contract';
import Record from '../Record';
import NoKey from './NoKey';
export declare type Strategy = (value: any, parent: any, key: string) => any;
export default class ProcessStrategy {
    /**
     * Create the process strategy.
     */
    static create(noKey: NoKey, model: typeof BaseModel, parent?: typeof BaseModel, attr?: Relation): Strategy;
    /**
     * Normalize individual records.
     */
    static fix(record: Record, model: typeof BaseModel): Record;
    /**
     * Normalize individual records.
     */
    static processFix(record: Record | undefined, fields: Fields): Record;
    /**
     * Set id field to the record.
     */
    static setId(record: Record, model: typeof BaseModel, noKey: NoKey, key: string): Record;
    /**
     * Generate morph fields. This method will generate fileds needed for the
     * morph fields such as `commentable_id` and `commentable_type`.
     */
    static generateMorphFields(record: Record, parentValue: any, parent?: typeof BaseModel, attr?: Relation): Record;
}
