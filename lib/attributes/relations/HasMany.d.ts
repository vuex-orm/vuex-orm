import { Record, NormalizedData } from '../../data';
import BaseModel from '../../model/BaseModel';
import Query, { Relation as Load } from '../../query/Query';
import Relation from './Relation';
export default class HasMany extends Relation {
    /**
     * The related BaseModel.
     */
    related: typeof BaseModel;
    /**
     * The foregin key of the related BaseModel.
     */
    foreignKey: string;
    /**
     * The local key of the model.
     */
    localKey: string;
    /**
     * Create a new has many instance.
     */
    constructor(model: typeof BaseModel, related: typeof BaseModel | string, foreignKey: string, localKey: string);
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
    attach(key: any, record: Record, data: NormalizedData): void;
    /**
     * Load the has many relationship for the record.
     */
    load(query: Query, collection: Record[], relation: Load): Record[];
}
