import * as Vuex from 'vuex';
import Connection from '../connections/Connection';
import { Record, Records } from '../data';
import { Fields } from '../attributes/contracts/Contract';
import Attribute from '../attributes/Attribute';
import Attr from '../attributes/types/Attr';
import String from '../attributes/types/String';
import Number from '../attributes/types/Number';
import Boolean from '../attributes/types/Boolean';
import Increment from '../attributes/types/Increment';
import HasOne from '../attributes/relations/HasOne';
import BelongsTo from '../attributes/relations/BelongsTo';
import HasMany from '../attributes/relations/HasMany';
import HasManyBy from '../attributes/relations/HasManyBy';
import HasManyThrough from '../attributes/relations/HasManyThrough';
import BelongsToMany from '../attributes/relations/BelongsToMany';
import MorphTo from '../attributes/relations/MorphTo';
import MorphOne from '../attributes/relations/MorphOne';
import MorphMany from '../attributes/relations/MorphMany';
import MorphToMany from '../attributes/relations/MorphToMany';
import MorphedByMany from '../attributes/relations/MorphedByMany';
export default class BaseModel {
    /**
     * Name of the connection that this model is registerd.
     */
    static connection: string;
    /**
     * The name that is going be used as module name in Vuex Store.
     */
    static entity: string;
    /**
     * The primary key to be used for the model.
     */
    static primaryKey: string | string[];
    [key: string]: any;
    /**
     * Create a model instance.
     */
    constructor(record?: Record);
    /**
     * The definition of the fields of the model and its relations.
     */
    static fields(): Fields;
    /**
     * Create an attr attribute. The given value will be used as a default
     * value for the field.
     */
    static attr(value: any, mutator?: (value: any) => any): Attr;
    /**
     * Create a string attribute.
     */
    static string(value: any, mutator?: (value: any) => any): String;
    /**
     * Create a number attribute.
     */
    static number(value: any, mutator?: (value: any) => any): Number;
    /**
     * Create a boolean attribute.
     */
    static boolean(value: any, mutator?: (value: any) => any): Boolean;
    /**
     * Create an increment attribute. The field with this attribute will
     * automatically increment its value when creating a new record.
     */
    static increment(): Increment;
    /**
     * Create a has one relationship.
     */
    static hasOne(related: typeof BaseModel | string, foreignKey: string, localKey?: string): HasOne;
    /**
     * Create a belongs to relationship.
     */
    static belongsTo(parent: typeof BaseModel | string, foreignKey: string, ownerKey?: string): BelongsTo;
    /**
     * Create a has many relationship.
     */
    static hasMany(related: typeof BaseModel | string, foreignKey: string, localKey?: string): HasMany;
    /**
     * Create a has many by relationship.
     */
    static hasManyBy(parent: typeof BaseModel | string, foreignKey: string, ownerKey?: string): HasManyBy;
    /**
     * Create a has many through relationship.
     */
    static hasManyThrough(related: typeof BaseModel | string, through: typeof BaseModel | string, firstKey: string, secondKey: string, localKey?: string, secondLocalKey?: string): HasManyThrough;
    /**
     * The belongs to many relationship.
     */
    static belongsToMany(related: typeof BaseModel | string, pivot: typeof BaseModel | string, foreignPivotKey: string, relatedPivotKey: string, parentKey?: string, relatedKey?: string): BelongsToMany;
    /**
     * Create a morph to relationship.
     */
    static morphTo(id: string, type: string): MorphTo;
    /**
     * Create a morph one relationship.
     */
    static morphOne(related: typeof BaseModel | string, id: string, type: string, localKey?: string): MorphOne;
    /**
     * Create a morph many relationship.
     */
    static morphMany(related: typeof BaseModel | string, id: string, type: string, localKey?: string): MorphMany;
    /**
     * Create a morph to many relationship.
     */
    static morphToMany(related: typeof BaseModel | string, pivot: typeof BaseModel | string, relatedId: string, id: string, type: string, parentKey?: string, relatedKey?: string): MorphToMany;
    /**
     * Create a morphed by many relationship.
     */
    static morphedByMany(related: typeof BaseModel | string, pivot: typeof BaseModel | string, relatedId: string, id: string, type: string, parentKey?: string, relatedKey?: string): MorphedByMany;
    /**
     * Mutators to mutate matching fields when instantiating the model.
     */
    static mutators(): {
        [field: string]: (value: any) => any;
    };
    /**
     * Get connection instance out of the container.
     */
    static conn(): Connection;
    /**
     * Get Vuex Store instance out of connection.
     */
    static store(): Vuex.Store<any>;
    /**
     * Get module namespaced path for the model.
     */
    static namespace(method: string): string;
    /**
     * Dispatch an action.
     */
    static dispatch(method: string, payload: any): Promise<any>;
    /**
     * Call getetrs.
     */
    static getters(method: string): any;
    /**
     * Get the value of the primary key.
     */
    static id(record: any): any;
    /**
     * Get local key to pass to the attributes.
     */
    static localKey(key?: string): string;
    /**
     * Get a model from the container.
     */
    static relation(model: typeof BaseModel | string): typeof BaseModel;
    /**
     * Get the attribute class for the given attribute name.
     */
    static getAttributeClass(name: string): typeof Attribute;
    /**
     * Get all of the fields that matches the given attribute name.
     */
    static getFields(name: string): {
        [key: string]: Attribute;
    };
    /**
     * Get all `increment` fields from the schema.
     */
    static getIncrementFields(): {
        [key: string]: Increment;
    };
    /**
     * Check if fields contains the `increment` field type.
     */
    static hasIncrementFields(): boolean;
    /**
     * Get all `belongsToMany` fields from the schema.
     */
    static pivotFields(): {
        [key: string]: BelongsToMany | MorphToMany | MorphedByMany;
    }[];
    /**
     * Check if fields contains the `belongsToMany` field type.
     */
    static hasPivotFields(): boolean;
    /**
     * Remove any fields not defined in the model schema. This method
     * also fixes any incorrect values as well.
     */
    static fix(data: Record, keep?: string[], fields?: Fields): Record;
    /**
     * Fix multiple records.
     */
    static fixMany(data: Records, keep?: string[]): Records;
    /**
     * Fill any missing fields in the given data with the default
     * value defined in the model schema.
     */
    static hydrate(data: Record, keep?: string[], fields?: Fields): Record;
    /**
     * Fill multiple records.
     */
    static hydrateMany(data: Records, keep?: string[]): Records;
    /**
     * Fill the given obejct with the given record. If no record were passed,
     * or if the record has any missing fields, each value of the fields will
     * be filled with its default value defined at model fields definition.
     */
    static fill(self?: BaseModel | Record, record?: Record, fields?: Fields): BaseModel | Record;
    /**
     * Get the static class of this model.
     */
    $self(): typeof BaseModel;
    /**
     * The definition of the fields of the model and its relations.
     */
    $fields(): Fields;
    /**
     * Get the value of the primary key.
     */
    $id(): any;
    /**
     * Get the connection instance out of the container.
     */
    $conn(): Connection;
    /**
     * Get Vuex Store insatnce out of connection.
     */
    $store(): Vuex.Store<any>;
    /**
     * Get module namespaced path for the model.
     */
    $namespace(method: string): string;
    /**
     * Dispatch an action.
     */
    $dispatch(method: string, payload: any): Promise<any>;
    /**
     * Call getetrs.
     */
    $getters(method: string): any;
    /**
     * Fill the model instance with the given record. If no record were passed,
     * or if the record has any missing fields, each value of the fields will
     * be filled with its default value defined at model fields definition.
     */
    $fill(record?: Record): void;
    /**
     * Serialize field values into json.
     */
    $toJson(): any;
    /**
     * Build Json data.
     */
    $buildJson(data: Fields, field: {
        [key: string]: any;
    }): any;
}
