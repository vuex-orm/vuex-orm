import MorphOne from '../relations/MorphOne';
import MorphMany from '../relations/MorphMany';
import Type from './Type';
import Relation from './Relation';
export declare type Field = Fields | Attribute;
export interface Fields {
    [key: string]: Field;
}
export declare type Attribute = Type | Relation;
export declare type Type = Type;
export declare type Relation = Relation;
export default class Contract {
    /**
     * Determine if the given value is the type of fields.
     */
    static isFields(attr: Field): attr is Fields;
    /**
     * Determine if the given value is the type of field.
     */
    static isAttribute(attr: Field): attr is Attribute;
    /**
     * Determine if the given value is the type of relations.
     */
    static isRelation(attr: Field): attr is Relation;
    /**
     * Determine if the given value is the type of morph relations.
     */
    static isMorphRelation(attr: Relation): attr is MorphOne | MorphMany;
}
