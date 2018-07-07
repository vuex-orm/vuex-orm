import Record from '../../data/Record';
import BaseModel from '../../model/BaseModel';
import Type from './Type';
export default class Boolean extends Type {
    /**
     * The default value of the field.
     */
    value: boolean;
    /**
     * Create a new number instance.
     */
    constructor(model: typeof BaseModel, value: boolean, mutator?: (value: any) => any);
    /**
     * Transform given data to the appropriate value. This method will be called
     * during data normalization to fix field that has an incorrect value,
     * or add a missing field with the appropriate default value.
     */
    fill(value: any): boolean;
    /**
     * Make value to be set to BaseModel property. This method is used when
     * instantiating a BaseModel or creating a plain object from a BaseModel.
     */
    make(value: any, _parent: Record, key: string): any;
}
