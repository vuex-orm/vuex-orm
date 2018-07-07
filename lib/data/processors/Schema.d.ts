import { schema, Schema as NormalizrSchema } from 'normalizr';
import BaseModel from '../../model/BaseModel';
import { Field, Fields, Relation } from '../../attributes/contracts/Contract';
import MorphTo from '../../attributes/relations/MorphTo';
export interface Schemas {
    [entity: string]: schema.Entity;
}
export default class Schema {
    /**
     * Create a schema for the given model.
     */
    static one(model: typeof BaseModel, schemas?: Schemas, parent?: typeof BaseModel, attr?: Relation): schema.Entity;
    /**
     * Create an array schema for the given model.
     */
    static many(model: typeof BaseModel, schemas?: Schemas, parent?: typeof BaseModel, attr?: Relation): schema.Array;
    /**
     * Create a dfinition for the given model.
     */
    static definition(model: typeof BaseModel, schemas: Schemas, fields?: Fields): NormalizrSchema;
    /**
     * Build normalizr schema definition from the given relation.
     */
    static buildRelations(model: typeof BaseModel, field: Field, schemas: Schemas): NormalizrSchema | null;
    /**
     * Build a single entity schema definition.
     */
    static buildOne(related: typeof BaseModel, schemas: Schemas, parent: typeof BaseModel, attr: Relation): schema.Entity;
    /**
     * Build a array entity schema definition.
     */
    static buildMany(related: typeof BaseModel, schemas: Schemas, parent: typeof BaseModel, attr: Relation): schema.Array;
    /**
     * Build a morph schema definition.
     */
    static buildMorphOne(attr: MorphTo, schemas: Schemas, parent: typeof BaseModel): schema.Union;
}
