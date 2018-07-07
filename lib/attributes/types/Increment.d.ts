import Record from '../../data/Record';
import Type from './Type';
export default class Increment extends Type {
    /**
     * The initial count to start incrementing.
     */
    value: number;
    /**
     * Transform given data to the appropriate value. This method will be called
     * during data normalization to fix field that has an incorrect value,
     * or add a missing field with the appropriate default value.
     */
    fill(value: any): number | null;
    /**
     * Make value to be set to BaseModel property. This method is used when
     * instantiating a BaseModel or creating a plain object from a BaseModel.
     */
    make(value: any, _parent: Record, _key: string): number | null;
}
