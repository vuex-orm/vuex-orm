import Record from '../../data/Record';
import BaseModel from '../../model/BaseModel';
import Type from './Type';
export default class Attr extends Type {
    /**
     * The default value of the field.
     */
    value: any;
    /**
     * Create a new attr instance.
     */
    constructor(model: typeof BaseModel, value: any, mutator?: (value: any) => any);
    /**
     * Transform given data to the appropriate value. This method will be called
     * during data normalization to fix field that has an incorrect value,
     * or add a missing field with the appropriate default value.
     */
    fill(value: any): any;
    /**
     * Make value to be set to BaseModel property. This method is used when
     * instantiating a BaseModel or creating a plain object from a BaseModel.
     */
    make(value: any, _parent: Record, key: string): any;
}
