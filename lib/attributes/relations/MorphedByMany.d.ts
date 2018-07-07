import { Record, NormalizedData } from '../../data';
import BaseModel from '../../model/BaseModel';
import Query, { Relation as Load } from '../../query/Query';
import Relation from './Relation';
export declare type Entity = typeof BaseModel | string;
export default class MorphedByMany extends Relation {
    /**
     * The related BaseModel.
     */
    related: typeof BaseModel;
    /**
     * The pivot BaseModel.
     */
    pivot: typeof BaseModel;
    /**
     * The field name that conatins id of the related BaseModel.
     */
    relatedId: string;
    /**
     * The field name that contains id of the parent BaseModel.
     */
    id: string;
    /**
     * The field name fthat contains type of the parent BaseModel.
     */
    type: string;
    /**
     * The key name of the parent BaseModel.
     */
    parentKey: string;
    /**
     * The key name of the related BaseModel.
     */
    relatedKey: string;
    /**
     * Create a new belongs to instance.
     */
    constructor(model: typeof BaseModel, related: Entity, pivot: Entity, relatedId: string, id: string, type: string, parentKey: string, relatedKey: string);
    /**
     * Transform given data to the appropriate value. This method will be called
     * during data normalization to fix field that has an incorrect value,
     * or add a missing field with the appropriate default value.
     */
    fill(value: any): (string | number | Record)[];
    /**
     * Make value to be set to BaseModel property. This method is used when
     * instantiating a BaseModel or creating a plain object from a BaseModel.
     */
    make(value: any, _parent: Record, _key: string): BaseModel[];
    /**
     * Attach the relational key to the given record.
     */
    attach(_key: any, _record: Record, _data: NormalizedData): void;
    /**
     * Load the morph many relationship for the record.
     */
    load(query: Query, collection: Record[], relation: Load): Record[];
    /**
     * Create pivot records for the given records if needed.
     */
    createPivots(parent: typeof BaseModel, data: NormalizedData): NormalizedData;
    /**
     * Create a pivot record.
     */
    createPivotRecord(data: NormalizedData, record: Record, related: any[]): void;
}
