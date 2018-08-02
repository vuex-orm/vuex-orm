import { Record, NormalizedData } from '../../data';
import BaseModel from '../../model/BaseModel';
import Query, { Relation as Load } from '../../query/Query';
import Relation from './Relation';
export declare type Entity = typeof BaseModel | string;
export default class HasManyThrough extends Relation {
    /**
     * The related BaseModel.
     */
    related: typeof BaseModel;
    /**
     * The "through" parent BaseModel.
     */
    through: typeof BaseModel;
    /**
     * The near key on the relationship.
     */
    firstKey: string;
    /**
     * The far key on the relationship.
     */
    secondKey: string;
    /**
     * The local key on the relationship.
     */
    localKey: string;
    /**
     * The local key on the intermediary BaseModel.
     */
    secondLocalKey: string;
    /**
     * Create a new has many through instance.
     */
    constructor(model: typeof BaseModel, related: Entity, through: Entity, firstKey: string, secondKey: string, localKey: string, secondLocalKey: string);
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
     * Load the has many through relationship for the record.
     */
    load(query: Query, collection: Record[], relation: Load): Record[];
}
