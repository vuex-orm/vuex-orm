import BaseModel from '../../model/BaseModel';
import NoKey from './NoKey';
export declare type Attribute = (value: any, parent: any, key: string) => any;
export default class IdAttribute {
    /**
     * Create the id attribute.
     */
    static create(noKey: NoKey, model: typeof BaseModel): Attribute;
}
