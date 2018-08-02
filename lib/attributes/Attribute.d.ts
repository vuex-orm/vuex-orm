import Record from '../data/Record';
import BaseModel from '../model/BaseModel';
export default abstract class Attribute {
    /**
     * The model that this attributes is being registerd.
     */
    model: typeof BaseModel;
    /**
     * Create a new attribute instance.
     */
    constructor(model: typeof BaseModel);
    /**
     * Transform given data to the appropriate value. This method will be called
     * during data normalization to fix field that has an incorrect value,
     * or add a missing field with the appropriate default value.
     */
    abstract fill(value: any): any;
    /**
     * Make value to be set to BaseModel property. This method is used when
     * instantiating a BaseModel or creating a plain object from a BaseModel.
     */
    abstract make(value: any, parent: Record, key: string): any;
}
