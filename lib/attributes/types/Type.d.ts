import BaseModel from '../../model/BaseModel';
import Attribute from '../Attribute';
export default abstract class Type extends Attribute {
    /**
     * The mutator for the field.
     */
    mutator?: (value: any) => any;
    /**
     * Create a new type instance.
     */
    constructor(model: typeof BaseModel, mutator?: (value: any) => any);
    /**
     * Mutate the given value by mutator.
     */
    mutate(value: any, key: string): any;
}
